import Chat from "../../models/Referrals/ChatModel.js";
import ChatMessage from "../../models/Referrals/MessageModel.js";
import Application from "../../models/Referrals/ApplicationModel.js";
import Student from "../../models/Referrals/StudentModel.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import { getIO, onlineUsers } from "../../sockets/index.js";
import { notificationService } from "../../services/NotificationService.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Allowed formats and MIME types
const ALLOWED_MIMES = {
  // Images (Max 10MB)
  "image/png": { ext: "png", maxBytes: 10 * 1024 * 1024 },
  "image/jpeg": { ext: "jpeg", maxBytes: 10 * 1024 * 1024 },
  "image/jpg": { ext: "jpg", maxBytes: 10 * 1024 * 1024 },
  "image/webp": { ext: "webp", maxBytes: 10 * 1024 * 1024 },
  // Documents (Max 15MB)
  "application/pdf": { ext: "pdf", maxBytes: 15 * 1024 * 1024 },
  "application/msword": { ext: "doc", maxBytes: 15 * 1024 * 1024 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { ext: "docx", maxBytes: 15 * 1024 * 1024 }
};

// Check if user is participant of chat and student meets eligibility requirements
const checkChatAccess = async (chatId, userId) => {
  const chat = await Chat.findById(chatId);
  if (!chat) return null;

  const isStudent = chat.student.toString() === userId;
  const isAlumni = chat.alumni.toString() === userId;

  if (!isStudent && !isAlumni) return null;

  // Verify that an application exists between this student and alumni with valid status
  const validStatuses = ["Applied", "Shortlisted", "Referred", "pending", "approved"];
  const appExists = await Application.findOne({
    student: chat.student,
    alumni: chat.alumni,
    status: { $in: validStatuses }
  });

  if (!appExists) return null;

  return {
    chat,
    role: isStudent ? "student" : "alumni",
    otherUserId: isStudent ? chat.alumni.toString() : chat.student.toString()
  };
};

// Emitters for real-time WebSocket events
const emitMessage = (recipientId, event, data) => {
  try {
    const io = getIO();
    io.to(recipientId).emit(event, data);
  } catch (error) {
    console.warn(`[Socket] Failed to emit ${event} to ${recipientId}:`, error.message);
  }
};

// 1. Get Chats (With Self-Healing Application Reconciliation & Profile Eligibility enforcement)
export const getChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || req.user.accountType;

    console.log("==============");
    console.log("GET CHATS");
    console.log("User:", req.user.id);
    console.log("Role:", req.user.role);

    const validStatuses = ["Applied", "Shortlisted", "Referred", "pending", "approved"];

    // --- Dynamic Self-Healing Reconciliation ---
    // Fetch all applications involving the user with valid statuses
    const appQuery = userRole === "alumni" ? { alumni: userId } : { student: userId };
    appQuery.status = { $in: validStatuses };
    const applications = await Application.find(appQuery);

    console.log("Applications Found:", applications.length);
    console.log(
      applications.map(a => ({
         id: a._id,
         status: a.status,
         student: a.student,
         alumni: a.alumni
      }))
    );

    // Identify unique student-alumni pairs
    const pairs = [];
    const pairKeys = new Set();

    for (const app of applications) {
      const key = `${app.student}-${app.alumni}`;
      if (!pairKeys.has(key)) {
        pairKeys.add(key);
        pairs.push({ student: app.student, alumni: app.alumni });
      }
    }

    // Ensure a chat exists for each pair
    for (const pair of pairs) {
      await Chat.findOneAndUpdate(
        { student: pair.student, alumni: pair.alumni },
        { $setOnInsert: { student: pair.student, alumni: pair.alumni } },
        { upsert: true, new: true }
      );
    }

    // Retrieve active chats
    const chats = await Chat.find({
      $or: [{ student: userId }, { alumni: userId }]
    })
      .populate("student", "firstName lastName email image branch graduationYear profileCompleteness")
      .populate("alumni", "firstName lastName email image company jobTitle")
      .populate({
        path: "lastMessage",
        populate: { path: "replyTo", select: "text file sender senderType" }
      })
      .sort({ updatedAt: -1 });

    console.log("Raw Chats:", chats.length);

    const activePartnerIds = new Set(
      applications.map(app => 
        userRole === "alumni" ? app.student.toString() : app.alumni.toString()
      )
    );

    console.log("=== CHAT DIAGNOSTICS ===");
    console.log("User ID:", userId);
    console.log("User Role:", userRole);
    console.log("Applications (Valid):", applications.length);
    console.log("Chats Found:", chats.length);

    // Format response and determine unread badge counts and online status, filtering out ineligible student chats
    const data = chats
      .filter(chat => {
        if (!chat.student) {
          console.log("No student found in chat object");
          return false;
        }

        const partnerId = userRole === "alumni" ? chat.student?._id?.toString() : chat.alumni?._id?.toString();
        const hasActiveApp = partnerId && activePartnerIds.has(partnerId);
        console.log(`Student ${chat.student._id} - Active App: ${hasActiveApp}`);
        
        return hasActiveApp;
      })
      .map(chat => {
        const chatObj = chat.toObject();
        chatObj.unreadCount = userRole === "alumni" ? chat.unreadCountAlumni : chat.unreadCountStudent;
        
        if (chatObj.student) {
          chatObj.student.isOnline = onlineUsers.has(chat.student._id.toString());
        }
        if (chatObj.alumni) {
          chatObj.alumni.isOnline = onlineUsers.has(chat.alumni._id.toString());
        }
        
        return chatObj;
      });

    console.log("Filtered Chats:", data.length);
    console.log("========================");

    const responsePayload = {
      success: true,
      data,
      message: "Conversations fetched successfully",
    };

    if (process.env.NODE_ENV !== "production") {
      responsePayload.diagnostics = {
        userId,
        userRole,
        applicationsCount: applications.length,
        chatsCount: chats.length,
        filteredChatsCount: data.length,
        applications: applications.map(app => ({
          _id: app._id,
          student: app.student,
          alumni: app.alumni,
          status: app.status
        })),
        chats: chats.map(c => ({
          _id: c._id,
          student: c.student ? { _id: c.student._id, profileCompleteness: c.student.profileCompleteness } : null,
          alumni: c.alumni ? c.alumni._id : null
        }))
      };
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Get chats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

// 2. Get Paginated Messages for Chat Room
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const access = await checkChatAccess(chatId, userId);
    if (!access) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view messages in this conversation",
      });
    }

    const messages = await ChatMessage.find({ chat: chatId })
      .populate("replyTo", "text file sender senderType")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Check if there are more messages
    const total = await ChatMessage.countDocuments({ chat: chatId });
    const hasMore = skip + messages.length < total;

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        hasMore
      },
      message: "Messages fetched successfully"
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch message history",
    });
  }
};

// 3. Send Text Message
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { text, replyTo } = req.body;

    if (!text && !replyTo) {
      return res.status(400).json({
        success: false,
        message: "Message content cannot be empty",
      });
    }

    const access = await checkChatAccess(chatId, userId);
    if (!access) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to send messages in this conversation",
      });
    }

    const { chat, role, otherUserId } = access;

    // Create message document
    const message = await ChatMessage.create({
      chat: chatId,
      sender: userId,
      senderType: role,
      text: text ? text.trim() : "",
      replyTo: replyTo || null
    });

    // Update conversation lastMessage and unread counts
    chat.lastMessage = message._id;
    if (role === "student") {
      chat.unreadCountAlumni += 1;
    } else {
      chat.unreadCountStudent += 1;
    }
    await chat.save();

    const populatedMessage = await ChatMessage.findById(message._id)
      .populate("replyTo", "text file sender senderType");

    // Emit real-time WebSocket updates
    emitMessage(otherUserId, "message", populatedMessage);
    emitMessage(userId, "message", populatedMessage); // Sync multi-device for sender

    // Generate System Notification
    const senderName = req.user.firstName ? `${req.user.firstName} ${req.user.lastName}` : "Someone";
    await notificationService.createAndEmitNotification({
      recipientId: otherUserId,
      senderId: userId,
      type: "REFERRAL",
      title: "New Message",
      message: `${senderName}: ${text ? (text.length > 50 ? text.slice(0, 50) + "..." : text) : "sent an attachment"}`,
      link: `/${role === "student" ? "alumni" : "student"}/chat`
    }).catch(err => console.error("Notification trigger warning:", err.message));

    return res.status(201).json({
      success: true,
      data: populatedMessage,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// 4. Reset Unread Counts & Mark Read
export const markRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const access = await checkChatAccess(chatId, userId);
    if (!access) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { chat, role, otherUserId } = access;

    // Reset unread count in Chat room
    if (role === "student") {
      chat.unreadCountStudent = 0;
    } else {
      chat.unreadCountAlumni = 0;
    }
    await chat.save();

    // Mark messages sent by the other participant as read
    await ChatMessage.updateMany(
      { chat: chatId, sender: otherUserId, isRead: false },
      { $set: { isRead: true } }
    );

    // Notify other participant of read receipts
    emitMessage(otherUserId, "message_read", { chatId, readerId: userId });

    return res.status(200).json({
      success: true,
      message: "Conversation marked as read"
    });
  } catch (error) {
    console.error("Mark read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update read state",
    });
  }
};

// 5. Secure Attachment Upload
export const uploadAttachment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { replyTo } = req.body;

    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "File attachment is required",
      });
    }

    const access = await checkChatAccess(chatId, userId);
    if (!access) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to upload attachments here",
      });
    }

    const { chat, role, otherUserId } = access;
    const uploadedFile = req.files.file;

    // 1. Validate MIME
    const mimeConfig = ALLOWED_MIMES[uploadedFile.mimetype];
    if (!mimeConfig) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format. Allowed formats: PNG, JPG, JPEG, WEBP, PDF, DOC, DOCX"
      });
    }

    // 2. Validate Size
    if (uploadedFile.size > mimeConfig.maxBytes) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds limits (${mimeConfig.maxBytes / (1024 * 1024)}MB max)`
      });
    }

    // 3. Validate Extension
    const fileExt = path.extname(uploadedFile.name).toLowerCase().replace(/^\./, "");
    const expectedExt = mimeConfig.ext;
    if (fileExt !== expectedExt && !(expectedExt === "jpeg" && fileExt === "jpg")) {
      return res.status(400).json({
        success: false,
        message: "File extension does not match its content MIME type"
      });
    }

    // Create uploads/chat folder
    const uploadDir = path.join("uploads", "chat");
    fs.mkdirSync(uploadDir, { recursive: true });

    // Generate random secure filename
    const uniqueFileName = `${uuidv4()}.${expectedExt}`;
    const destinationPath = path.join(uploadDir, uniqueFileName);

    // Move file to final location
    await uploadedFile.mv(destinationPath);

    // Save ChatMessage
    const message = await ChatMessage.create({
      chat: chatId,
      sender: userId,
      senderType: role,
      text: "",
      file: {
        url: `/api/v1/chats/attachments/${uniqueFileName}`,
        name: uploadedFile.name,
        type: uploadedFile.mimetype,
        size: uploadedFile.size
      },
      replyTo: replyTo || null
    });

    chat.lastMessage = message._id;
    if (role === "student") {
      chat.unreadCountAlumni += 1;
    } else {
      chat.unreadCountStudent += 1;
    }
    await chat.save();

    const populatedMessage = await ChatMessage.findById(message._id)
      .populate("replyTo", "text file sender senderType");

    emitMessage(otherUserId, "message", populatedMessage);
    emitMessage(userId, "message", populatedMessage);

    return res.status(201).json({
      success: true,
      data: populatedMessage,
      message: "Attachment uploaded successfully"
    });
  } catch (error) {
    console.error("Upload attachment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload file attachment"
    });
  }
};

// 6. Secure Download Attachment Route
export const downloadAttachment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileName } = req.params;

    // Find the message corresponding to this file
    const fileUrlPath = `/api/v1/chats/attachments/${fileName}`;
    const message = await ChatMessage.findOne({ "file.url": fileUrlPath });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found in chat records"
      });
    }

    // Check permissions
    const access = await checkChatAccess(message.chat, userId);
    if (!access) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this file"
      });
    }

    const filePath = path.join("uploads", "chat", fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical file not found on disk"
      });
    }

    // Deliver file
    return res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error("Download attachment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error retrieving attachment"
    });
  }
};

// 7. Edit Message
export const editMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text cannot be empty",
      });
    }

    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check ownership
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own messages",
      });
    }

    if (message.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Deleted messages cannot be edited",
      });
    }

    // Maintain edit history
    message.editHistory.push({
      text: message.text,
      editedAt: message.editedAt || message.updatedAt
    });

    message.text = text.trim();
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    const access = await checkChatAccess(message.chat, userId);
    if (access) {
      const updatePayload = {
        messageId: message._id,
        text: message.text,
        isEdited: true,
        editedAt: message.editedAt
      };
      emitMessage(access.otherUserId, "message_update", updatePayload);
      emitMessage(userId, "message_update", updatePayload);
    }

    return res.status(200).json({
      success: true,
      data: message,
      message: "Message edited successfully"
    });
  } catch (error) {
    console.error("Edit message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit message",
    });
  }
};

// 8. Delete Message (Soft Delete)
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check ownership
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    if (message.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Message is already deleted",
      });
    }

    // Soft delete details
    message.isDeleted = true;
    message.text = "This message was deleted";
    message.file = undefined; // Remove file info

    await message.save();

    const access = await checkChatAccess(message.chat, userId);
    if (access) {
      const updatePayload = {
        messageId: message._id,
        text: message.text,
        isDeleted: true,
        file: null
      };
      emitMessage(access.otherUserId, "message_update", updatePayload);
      emitMessage(userId, "message_update", updatePayload);
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

// 9. Create Chat Conversation (Enforces student profile completeness eligibility)
export const createChat = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { alumniId } = req.body;

    if (!alumniId) {
      return res.status(400).json({
        success: false,
        message: "Alumni ID is required",
      });
    }

    // 1. Enforce active application check
    const validStatuses = ["Applied", "Shortlisted", "Referred", "pending", "approved"];
    const appExists = await Application.findOne({
      student: studentId,
      alumni: alumniId,
      status: { $in: validStatuses }
    });

    if (!appExists) {
      return res.status(403).json({
        success: false,
        message: "Chat connections require active referral requests."
      });
    }

    // 3. Find or create the conversation
    const chat = await Chat.findOneAndUpdate(
      { student: studentId, alumni: alumniId },
      { $setOnInsert: { student: studentId, alumni: alumniId } },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      data: chat,
      message: "Conversation ready",
    });
  } catch (error) {
    console.error("Create chat error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize conversation",
    });
  }
};
