import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import ReferralStudent from "../models/Referrals/StudentModel.js";
import Tutor from "../models/Tutorials/Tutor.js";
import User from "../models/Tutorials/user.js";
import { Notification } from "../models/Notification.js";
import cloudinary from "../utils/Tutorials/cloudinary.js";
import { getIO } from "../sockets/index.js";
import fs from "fs";

// Allowed MIME types for secure upload
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Helper to fetch a user's display name
 */
const resolveSenderName = async (senderId, senderModel) => {
  try {
    if (senderModel === "ReferralStudent") {
      const s = await ReferralStudent.findById(senderId).lean();
      return s ? `${s.firstName || ""} ${s.lastName || ""}`.trim() : "Student";
    } else if (senderModel === "Tutor") {
      const t = await Tutor.findById(senderId).lean();
      return t ? (t.name || `${t.fName || ""} ${t.lName || ""}`.trim()) : "Tutor";
    } else {
      const u = await User.findById(senderId).lean();
      return u ? (u.profile?.displayName || `${u.profile?.fName || ""} ${u.profile?.lName || ""}`.trim() || u.user) : "User";
    }
  } catch (_) {
    return "User";
  }
};

/**
 * 🚀 Send Message with Cloudinary File Uploads and Valdiations
 */
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { conversationId, message } = req.body;

    if (!conversationId) {
      return res.status(400).json({ success: false, message: "conversationId is required" });
    }

    // 1. Fetch conversation and verify participant membership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    // 2. Block validation
    if (conversation.blockedBy) {
      return res.status(403).json({
        success: false,
        message: "Conversation is blocked. Cannot send messages.",
      });
    }

    // 3. Resolve sender and receiver fields
    const isStudent = conversation.studentId.toString() === senderId.toString();
    const senderModel = isStudent ? conversation.studentModel : conversation.tutorModel;
    
    const receiverId = isStudent ? conversation.tutorId : conversation.studentId;
    const receiverModel = isStudent ? conversation.tutorModel : conversation.studentModel;

    // 4. File Upload and Validation
    const attachments = [];
    if (req.files && Object.keys(req.files).length > 0) {
      const filesToUpload = Array.isArray(req.files.files)
        ? req.files.files
        : [req.files.files || req.files.file || req.files.attachment].filter(Boolean);

      for (const file of filesToUpload) {
        // Validation: Size check
        if (file.size > MAX_FILE_SIZE) {
          return res.status(400).json({
            success: false,
            message: `File ${file.name} exceeds the maximum size limit of 10MB.`,
          });
        }

        // Validation: MIME type check
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: `File type ${file.mimetype} is not allowed. Only JPG, PNG, PDF, and DOCX are supported.`,
          });
        }

        // Upload to Cloudinary
        try {
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "student_needs_chat_attachments",
            resource_type: "auto",
          });

          attachments.push({
            url: result.secure_url,
            name: file.name,
            mimeType: file.mimetype,
            publicId: result.public_id,
          });

          // Clean up temp file safely
          if (fs.existsSync(file.tempFilePath)) {
            fs.unlinkSync(file.tempFilePath);
          }
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          return res.status(500).json({ success: false, message: "Failed to upload attachments to Cloudinary" });
        }
      }
    }

    if (!message && attachments.length === 0) {
      return res.status(400).json({ success: false, message: "Cannot send an empty message." });
    }

    // 5. Create Message in Database
    const msg = await Message.create({
      conversationId,
      senderId,
      senderModel,
      receiverId,
      receiverModel,
      message: message || "",
      attachments,
    });

    // 6. Update Conversation status
    conversation.lastMessage = msg._id;
    conversation.lastMessageTime = new Date();

    // Increment recipient unread counter
    if (isStudent) {
      conversation.unreadCounts.tutor += 1;
    } else {
      conversation.unreadCounts.student += 1;
    }
    await conversation.save();

    const populatedMessage = await Message.findById(msg._id).lean();

    // 7. Relay message in real-time via Socket.io
    try {
      const io = getIO();
      // Send to recipient
      io.to(receiverId.toString()).emit("receiveMessage", populatedMessage);
      // Sync sender devices
      io.to(senderId.toString()).emit("receiveMessage", populatedMessage);
    } catch (socketErr) {
      console.warn("⚠️ Socket relay deferred (socket not initialized yet):", socketErr.message);
    }

    // 8. Trigger Platform Notification (Async in background)
    resolveSenderName(senderId, senderModel).then((senderName) => {
      Notification.create({
        recipientId: receiverId,
        senderId: senderId,
        type: "CHAT",
        title: "New Message",
        message: `${senderName}: ${message || "sent an attachment"}`,
        link: isStudent ? "/tutorials/tutor/chat" : "/student/tutor-chat",
      }).catch(err => console.error("Notification creation failed:", err));
    });

    return res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    console.error("🔥 Send Message Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🔍 Fetch messages (Cursor/Skip paginated)
 */
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));

    // Verify membership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const totalMessages = await Message.countDocuments({ conversationId });
    const skip = (page - 1) * limit;

    // Fetch messages descending (newest first)
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Reverse to chronological order (oldest first)
    messages.reverse();

    // 9. Reset unread counts on load & notify sender (if reader was recipient)
    const isStudent = conversation.studentId.toString() === currentUserId.toString();
    const hasUnread = isStudent
      ? conversation.unreadCounts.student > 0
      : conversation.unreadCounts.tutor > 0;

    if (hasUnread) {
      // Clear counter
      if (isStudent) {
        conversation.unreadCounts.student = 0;
      } else {
        conversation.unreadCounts.tutor = 0;
      }
      await conversation.save();

      // Mark partner's sent messages as seen
      const partnerId = isStudent ? conversation.tutorId : conversation.studentId;
      await Message.updateMany(
        { conversationId, senderId: partnerId, seen: false },
        { $set: { seen: true, delivered: true } }
      );

      // Emit read receipts
      try {
        const io = getIO();
        io.to(partnerId.toString()).emit("messageSeen", { conversationId, readerId: currentUserId });
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        totalMessages,
        hasMore: totalMessages > skip + messages.length,
      },
    });
  } catch (error) {
    console.error("🔥 Get Messages Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 👀 Mark single message as seen
 */
export const markMessageSeen = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { messageId } = req.params;

    const msg = await Message.findOne({ _id: messageId, receiverId: currentUserId });
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found or unauthorized" });
    }

    if (!msg.seen) {
      msg.seen = true;
      msg.delivered = true;
      await msg.save();

      // Decrement unread counter on conversation
      const conv = await Conversation.findById(msg.conversationId);
      if (conv) {
        const isStudent = conv.studentId.toString() === currentUserId.toString();
        if (isStudent && conv.unreadCounts.student > 0) {
          conv.unreadCounts.student = Math.max(0, conv.unreadCounts.student - 1);
        } else if (!isStudent && conv.unreadCounts.tutor > 0) {
          conv.unreadCounts.tutor = Math.max(0, conv.unreadCounts.tutor - 1);
        }
        await conv.save();
      }

      // Emit receipt
      try {
        getIO().to(msg.senderId.toString()).emit("messageSeen", { conversationId: msg.conversationId, readerId: currentUserId });
      } catch (_) {}
    }

    return res.status(200).json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.error("🔥 Seen Message Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✍️ Edit message
 */
export const editMessage = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Edited message cannot be empty" });
    }

    const msg = await Message.findOne({ _id: messageId, senderId: currentUserId });
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found or unauthorized" });
    }

    if (msg.deleted) {
      return res.status(400).json({ success: false, message: "Cannot edit a deleted message" });
    }

    msg.message = text;
    msg.isEdited = true;
    msg.editedAt = new Date();
    await msg.save();

    // Broadcast edit in real-time
    try {
      const io = getIO();
      io.to(msg.receiverId.toString()).emit("receiveMessage", msg);
      io.to(msg.senderId.toString()).emit("receiveMessage", msg);
    } catch (_) {}

    return res.status(200).json({ success: true, data: msg });
  } catch (error) {
    console.error("🔥 Edit Message Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🗑️ Soft delete message
 */
export const deleteMessage = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { messageId } = req.params;

    const msg = await Message.findOne({ _id: messageId, senderId: currentUserId });
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found or unauthorized" });
    }

    // Soft delete details
    msg.message = "This message was deleted";
    msg.deleted = true;
    // Delete attachments from Cloudinary if any
    for (const attachment of msg.attachments) {
      try {
        await cloudinary.uploader.destroy(attachment.publicId);
      } catch (e) {
        console.error("Failed to delete from Cloudinary:", attachment.publicId, e);
      }
    }
    msg.attachments = [];
    await msg.save();

    // Broadcast soft deletion
    try {
      const io = getIO();
      io.to(msg.receiverId.toString()).emit("receiveMessage", msg);
      io.to(msg.senderId.toString()).emit("receiveMessage", msg);
    } catch (_) {}

    return res.status(200).json({ success: true, data: msg });
  } catch (error) {
    console.error("🔥 Delete Message Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
