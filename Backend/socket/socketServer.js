import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import ReferralStudent from "../models/Referrals/StudentModel.js";
import Tutor from "../models/Tutorials/Tutor.js";
import User from "../models/Tutorials/user.js";

// Global online users map: Map<userId, socketId>
// Removed onlineTutorUsers, handled globally in Backend/sockets/index.js

export const registerTutorChatHandlers = (io, socket) => {
  const userId = socket.user?.id;
  if (!userId) return;

  const stringUserId = userId.toString();


  // 1. Join Conversation Room
  socket.on("joinConversation", (data) => {
    const { conversationId } = data || {};
    if (conversationId) {
      socket.join(conversationId);
      console.log(`🗣️ Socket ${socket.id} joined conversation: ${conversationId}`);
    }
  });

  // 2. Leave Conversation Room
  socket.on("leaveConversation", (data) => {
    const { conversationId } = data || {};
    if (conversationId) {
      socket.leave(conversationId);
      console.log(`🗣️ Socket ${socket.id} left conversation: ${conversationId}`);
    }
  });

  // 3. Typing Indicator Handlers
  socket.on("typing", (data) => {
    const { conversationId } = data || {};
    if (conversationId) {
      socket.to(conversationId).emit("typing", {
        conversationId,
        userId: stringUserId,
        isTyping: true,
      });
    }
  });

  socket.on("stopTyping", (data) => {
    const { conversationId } = data || {};
    if (conversationId) {
      socket.to(conversationId).emit("typing", {
        conversationId,
        userId: stringUserId,
        isTyping: false,
      });
    }
  });

  // 4. Send Message via Socket (Fallback/alternative to HTTP endpoint)
  socket.on("sendMessage", async (data, callback) => {
    try {
      const { conversationId, message, attachments = [] } = data || {};
      if (!conversationId) return;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: stringUserId,
      });

      if (!conversation || conversation.blockedBy) {
        if (typeof callback === "function") {
          callback({ success: false, message: "Unauthorized or chat blocked" });
        }
        return;
      }

      const isStudent = conversation.studentId.toString() === stringUserId;
      const senderModel = isStudent ? conversation.studentModel : conversation.tutorModel;
      
      const receiverId = isStudent ? conversation.tutorId : conversation.studentId;
      const receiverModel = isStudent ? conversation.tutorModel : conversation.studentModel;

      const newMsg = await Message.create({
        conversationId,
        senderId: stringUserId,
        senderModel,
        receiverId,
        receiverModel,
        message: message || "",
        attachments,
      });

      conversation.lastMessage = newMsg._id;
      conversation.lastMessageTime = new Date();
      if (isStudent) {
        conversation.unreadCounts.tutor += 1;
      } else {
        conversation.unreadCounts.student += 1;
      }
      await conversation.save();

      const msgObj = newMsg.toObject();

      // Emit to room
      io.to(conversationId).emit("receiveMessage", msgObj);

      // Sync user's other devices
      socket.to(stringUserId).emit("receiveMessage", msgObj);

      if (typeof callback === "function") {
        callback({ success: true, data: msgObj });
      }
    } catch (err) {
      console.error("Socket sendMessage Error:", err);
      if (typeof callback === "function") {
        callback({ success: false, message: err.message });
      }
    }
  });

  // 5. Message Mark Seen Receipt
  socket.on("messageSeen", async (data) => {
    try {
      const { conversationId } = data || {};
      if (!conversationId) return;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: stringUserId,
      });
      if (!conversation) return;

      const isStudent = conversation.studentId.toString() === stringUserId;
      const partnerId = isStudent ? conversation.tutorId : conversation.studentId;

      // Clear counter in DB
      if (isStudent) {
        conversation.unreadCounts.student = 0;
      } else {
        conversation.unreadCounts.tutor = 0;
      }
      await conversation.save();

      // Mark unseen as seen
      await Message.updateMany(
        { conversationId, senderId: partnerId, seen: false },
        { $set: { seen: true, delivered: true } }
      );

      // Broadcast receipt to partner
      io.to(partnerId.toString()).emit("messageSeen", {
        conversationId,
        readerId: stringUserId,
      });
    } catch (err) {
      console.error("Socket messageSeen Error:", err);
    }
  });

  // 6. Future-ready WebRTC Video Call Signaling Hooks
  socket.on("callUser", (data) => {
    const { userToCall, signalData, from, name } = data || {};
    if (userToCall) {
      io.to(`user:${userToCall.toString()}`).emit("callUser", {
        signal: signalData,
        from,
        name,
      });
    }
  });

  socket.on("answerCall", (data) => {
    const { to, signal } = data || {};
    if (to) {
      io.to(`user:${to.toString()}`).emit("callAccepted", signal);
    }
  });

  socket.on("endCall", (data) => {
    const { to } = data || {};
    if (to) {
      io.to(`user:${to.toString()}`).emit("callEnded");
    }
  });

  // 7. Future-ready AI Tutoring Hook
  socket.on("askAiTutor", async (data) => {
    const { question, subject } = data || {};
    // Future integration placeholder for streaming response
    socket.emit("aiTutorResponse", {
      status: "processing",
      text: "AI Tutor is analyzing your question on " + (subject || "General Science") + "...",
    });
  });

  // Disconnect handler
  socket.on("disconnect", async () => {
    // Presence is handled by Backend/sockets/index.js
    // Update database last seen timestamp
    try {
      await Tutor.findByIdAndUpdate(stringUserId, { lastSeen: new Date() });
      await ReferralStudent.findByIdAndUpdate(stringUserId, { lastSeen: new Date() });
      await User.findByIdAndUpdate(stringUserId, { lastSeen: new Date() });
    } catch (_) {}
  });
};
