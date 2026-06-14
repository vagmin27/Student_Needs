// Removed local onlineUsers map, presence is handled by Backend/sockets/index.js

export const registerChatHandlers = (io, socket) => {
  const userId = socket.user.id || socket.user._id;
  if (!userId) return;

  const stringUserId = userId.toString();


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

};
