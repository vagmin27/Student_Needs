// Map to track online users and their active connection counts
export const onlineUsers = new Map();

export const registerChatHandlers = (io, socket) => {
  const userId = socket.user.id || socket.user._id;
  if (!userId) return;

  const stringUserId = userId.toString();

  // Handle Online Presence
  const currentConnections = onlineUsers.get(stringUserId) || 0;
  onlineUsers.set(stringUserId, currentConnections + 1);

  if (currentConnections === 0) {
    // Broadcast that this user came online
    io.emit("user_status", {
      userId: stringUserId,
      status: "online",
      lastSeen: new Date()
    });
  }

  // Socket can request to get online list on connection
  socket.on("get_online_users", (callback) => {
    if (typeof callback === "function") {
      callback(Array.from(onlineUsers.keys()));
    }
  });

  // Handle Typing indicator
  socket.on("typing", async (data) => {
    try {
      const { chatId, isTyping } = data;
      if (!chatId) return;

      const Chat = (await import("../../models/Referrals/ChatModel.js")).default;
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      const otherUserId = chat.student.toString() === stringUserId 
        ? chat.alumni.toString() 
        : chat.student.toString();

      io.to(otherUserId).emit("typing", {
        chatId,
        userId: stringUserId,
        isTyping
      });
    } catch (err) {
      console.error("Socket typing handler error:", err.message);
    }
  });

  // Handle Mark Read
  socket.on("mark_read", async (data) => {
    try {
      const { chatId } = data;
      if (!chatId) return;

      const Chat = (await import("../../models/Referrals/ChatModel.js")).default;
      const ChatMessage = (await import("../../models/Referrals/MessageModel.js")).default;

      const chat = await Chat.findById(chatId);
      if (!chat) return;

      const otherUserId = chat.student.toString() === stringUserId 
        ? chat.alumni.toString() 
        : chat.student.toString();

      const role = chat.student.toString() === stringUserId ? "student" : "alumni";

      // Reset unread count
      if (role === "student") {
        chat.unreadCountStudent = 0;
      } else {
        chat.unreadCountAlumni = 0;
      }
      await chat.save();

      // Mark messages as read
      await ChatMessage.updateMany(
        { chat: chatId, sender: otherUserId, isRead: false },
        { $set: { isRead: true } }
      );

      // Emit read status
      io.to(otherUserId).emit("message_read", { chatId, readerId: stringUserId });
      socket.emit("message_read", { chatId, readerId: stringUserId }); // Sync other devices of same user
    } catch (err) {
      console.error("Socket mark_read handler error:", err.message);
    }
  });

  // Handle Disconnect (clean up presence)
  socket.on("disconnect", () => {
    const activeConns = onlineUsers.get(stringUserId) || 0;
    if (activeConns <= 1) {
      onlineUsers.delete(stringUserId);
      // Broadcast that this user went offline
      io.emit("user_status", {
        userId: stringUserId,
        status: "offline",
        lastSeen: new Date()
      });
    } else {
      onlineUsers.set(stringUserId, activeConns - 1);
    }
  });
};
