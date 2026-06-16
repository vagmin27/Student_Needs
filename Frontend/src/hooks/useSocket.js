import { useEffect, useRef, useState, useCallback } from "react";
import { useWebSocket } from "./useWebSocket.js";

export const useSocket = () => {
  const { isConnected, error, emit, on, off, socket, waitForSocket } = useWebSocket();
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Listen for global online/offline broadcasts
  useEffect(() => {
    if (!isConnected) return;

    const handleUserOnline = (data) => {
      if (data?.userId) {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.add(data.userId);
          return next;
        });
      }
    };

    const handleUserOffline = (data) => {
      if (data?.userId) {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    on("userOnline", handleUserOnline);
    on("userOffline", handleUserOffline);

    // Initial load of online users
    emit("get_online_users", (users) => {
      if (Array.isArray(users)) {
        setOnlineUsers(new Set(users));
      }
    });

    return () => {
      off("userOnline", handleUserOnline);
      off("userOffline", handleUserOffline);
    };
  }, [isConnected, on, off, emit]);

  // Join a specific conversation room
  const joinConversation = useCallback((conversationId) => {
    if (conversationId) {
      emit("joinConversation", { conversationId });
    }
  }, [emit]);

  // Leave a specific conversation room
  const leaveConversation = useCallback((conversationId) => {
    if (conversationId) {
      emit("leaveConversation", { conversationId });
    }
  }, [emit]);

  // Send message typing indicator
  const sendTypingStatus = useCallback((conversationId, isTyping) => {
    if (conversationId) {
      emit(isTyping ? "typing" : "stopTyping", { conversationId });
    }
  }, [emit]);

  // Mark a conversation's messages as seen
  const markConversationSeen = useCallback((conversationId) => {
    if (conversationId) {
      emit("messageSeen", { conversationId });
    }
  }, [emit]);

  // ========================================================
  //   FUTURE-READY WEBRTC SIGNALING HOOKS
  // ========================================================
  const callUser = useCallback((userIdToCall, signalData, currentUserId, currentUserName) => {
    emit("callUser", {
      userToCall: userIdToCall,
      signalData,
      from: currentUserId,
      name: currentUserName,
    });
  }, [emit]);

  const answerCall = useCallback((senderUserId, signal) => {
    emit("answerCall", { to: senderUserId, signal });
  }, [emit]);

  const endCall = useCallback((partnerUserId) => {
    emit("endCall", { to: partnerUserId });
  }, [emit]);

  // ========================================================
  //   FUTURE-READY AI TUTORING STREAMING HOOK
  // ========================================================
  const askAiTutor = useCallback((question, subject) => {
    emit("askAiTutor", { question, subject });
  }, [emit]);

  return {
    isConnected,
    error,
    socket,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendTypingStatus,
    markConversationSeen,
    // WebRTC video call functions
    callUser,
    answerCall,
    endCall,
    // AI Tutoring functions
    askAiTutor,
    // Native listeners
    on,
    off,
    emit,
    waitForSocket,
  };
};
export default useSocket;
