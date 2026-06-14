import TutorialMessage from "../models/Tutorials/TutorialMessage.js";
import TutorialConversation from "../models/Tutorials/TutorialConversation.js";
import { onlineUsers } from "./index.js";

const activeCalls = new Map(); // conversationId -> { caller, receiver, startTime, timeout, type }

export const registerTutorCallHandlers = (io, socket) => {
  const userId = socket.user?.id || socket.user?._id;

  // Initialize a call
  socket.on("call:start", async ({ conversationId, receiverId, type = "video" }, callback) => {
    console.log("[SERVER RECEIVED CALL START]");
    if (typeof callback === "function") callback();
    try {
      if (!userId || !receiverId || !conversationId) return;
      if (userId === receiverId) {
        return socket.emit("call:error", { message: "You cannot call yourself." });
      }

      // Check if there is an active call for this conversation
      if (activeCalls.has(conversationId)) {
        return socket.emit("call:error", { message: "A call is already active in this conversation." });
      }

      // Validate conversation booking status here if necessary
      // Assuming we have verified it on frontend or it's verified in middleware.
      const conversation = await TutorialConversation.findById(conversationId).populate("latestBookingId");
      if (!conversation) {
        return socket.emit("call:error", { message: "Conversation not found." });
      }

      // Check booking status if it exists, but for tutorials it might be in activeBookings or latestBookingId
      // The schema has latestBookingId. We won't block based on strict status checking here unless populated.

      const callSessionId = `${conversationId}_${Date.now()}`;

      // 30 seconds timeout if not answered
      const timeout = setTimeout(async () => {
        const call = activeCalls.get(conversationId);
        if (call && call.status === "calling" && call.callSessionId === callSessionId) {
          activeCalls.delete(conversationId);
          
          io.to(`user:${call.caller.toString()}`).emit("call:timeout", { conversationId });
          io.to(`user:${call.receiver.toString()}`).emit("call:missed", { conversationId });
          io.to(`user:${call.caller.toString()}`).emit("call:end", { conversationId, reason: "No answer" });
          io.to(`user:${call.receiver.toString()}`).emit("call:end", { conversationId, reason: "No answer" });
          
          await saveCallHistory(conversationId, call, 0);
        }
      }, 30 * 1000);

      activeCalls.set(conversationId, {
        caller: userId,
        receiver: receiverId,
        startTime: new Date(),
        timeout,
        type,
        conversationId,
        status: "calling",
        callSessionId
      });

      console.log(`[CALL START] timestamp=${new Date().toISOString()} socketId=${socket.id} userId=${userId} receiverId=${receiverId} conversationId=${conversationId} callSessionId=${callSessionId}`);

      const receiverIsOnline = onlineUsers.has(receiverId.toString()) && onlineUsers.get(receiverId.toString()).size > 0;
      if (receiverIsOnline) {
        console.log(`[CALL INCOMING] timestamp=${new Date().toISOString()} userId=${receiverId} conversationId=${conversationId} callSessionId=${callSessionId}`);
        console.log("[EMIT CALL INCOMING]", receiverId.toString());
        console.log({
          targetUser: receiverId.toString(),
          roomExists: io.sockets.adapter.rooms.has(`user:${receiverId.toString()}`),
          sockets: [...(io.sockets.adapter.rooms.get(`user:${receiverId.toString()}`) || [])]
        });
        // Emit incoming call to receiver's user room
        io.to(`user:${receiverId.toString()}`).emit("call:incoming", {
          conversationId,
          callerId: userId,
          type,
          callSessionId,
          callerInfo: {
            name: socket.user.name,
            role: socket.user.role,
          }
        });
      } else {
        clearTimeout(timeout);
        activeCalls.delete(conversationId);
        return socket.emit("call:user_offline", { message: "Tutor unavailable, Try later" });
      }
    } catch (err) {
      console.error("Error starting call:", err);
    }
  });

  socket.on("call:accepted", ({ conversationId, callSessionId }) => {
    const call = activeCalls.get(conversationId);
    console.log(`[CALL ACCEPT] timestamp=${new Date().toISOString()} socketId=${socket.id} userId=${userId} conversationId=${conversationId} callSessionId=${callSessionId}`);
    if (call && call.receiver.toString() === userId.toString()) {
      if (call.status === "calling") {
        clearTimeout(call.timeout); // Clear the 30-second timeout when answered
        call.status = "in_progress";
        call.acceptedSocketId = socket.id; // Lock to this socket
        io.to(`user:${call.caller.toString()}`).emit("call:accepted", { conversationId });
        // Cancel duplicate popups on receiver's other devices
        socket.to(`user:${call.receiver.toString()}`).emit("call:cancel_duplicate", { conversationId });
      } else if (call.status === "in_progress" && call.acceptedSocketId !== socket.id) {
        // Prevent duplicate popup
        socket.emit("call:cancel_duplicate", { conversationId });
      }
    }
  });

  socket.on("call:declined", async ({ conversationId }) => {
    const call = activeCalls.get(conversationId);
    if (call && call.receiver.toString() === userId.toString()) {
      clearTimeout(call.timeout);
      activeCalls.delete(conversationId);
      io.to(`user:${call.caller.toString()}`).emit("call:declined", { conversationId });
      // Cancel popups on receiver's other devices
      socket.to(`user:${call.receiver.toString()}`).emit("call:cancel_duplicate", { conversationId });
      
      // Save history
      await saveCallHistory(conversationId, call, 0);
    }
  });

  socket.on("call:offer", ({ conversationId, offer }) => {
    const call = activeCalls.get(conversationId);
    console.log(`[CALL OFFER] timestamp=${new Date().toISOString()} socketId=${socket.id} userId=${userId} conversationId=${conversationId}`);
    if (call) {
      console.log(`[WEBRTC OFFER] for conversation: ${conversationId}`);
      const targetId = call.caller.toString() === userId.toString() ? call.receiver : call.caller;
      console.log({
        targetUser: targetId.toString(),
        roomExists: io.sockets.adapter.rooms.has(`user:${targetId.toString()}`),
        sockets: [...(io.sockets.adapter.rooms.get(`user:${targetId.toString()}`) || [])]
      });
      io.to(`user:${targetId.toString()}`).emit("call:offer", { conversationId, offer });
    }
  });

  socket.on("call:answer", ({ conversationId, answer }) => {
    const call = activeCalls.get(conversationId);
    console.log(`[CALL ANSWER] timestamp=${new Date().toISOString()} socketId=${socket.id} userId=${userId} conversationId=${conversationId}`);
    if (call) {
      console.log(`[WEBRTC ANSWER] for conversation: ${conversationId}`);
      const targetId = call.caller.toString() === userId.toString() ? call.receiver : call.caller;
      console.log({
        targetUser: targetId.toString(),
        roomExists: io.sockets.adapter.rooms.has(`user:${targetId.toString()}`),
        sockets: [...(io.sockets.adapter.rooms.get(`user:${targetId.toString()}`) || [])]
      });
      io.to(`user:${targetId.toString()}`).emit("call:answer", { conversationId, answer });
    }
  });

  socket.on("call:ice_candidate", ({ conversationId, candidate }) => {
    const call = activeCalls.get(conversationId);
    console.log(`[ICE CANDIDATE] timestamp=${new Date().toISOString()} socketId=${socket.id} userId=${userId} conversationId=${conversationId}`);
    if (call) {
      const targetId = call.caller.toString() === userId.toString() ? call.receiver : call.caller;
      io.to(`user:${targetId.toString()}`).emit("call:ice_candidate", { conversationId, candidate });
    }
  });

  socket.on("call:end", async ({ conversationId }) => {
    await endCall(conversationId, io, "Call ended by user");
  });

  socket.on("disconnect", () => {
    activeCalls.forEach(async (call, convId) => {
      // If the specific socket that accepted the call disconnects, or if they were the caller
      if (
        call.caller.toString() === userId.toString() ||
        (call.receiver.toString() === userId.toString() && call.acceptedSocketId === socket.id)
      ) {
        await endCall(convId, io, "User disconnected");
      }
    });
  });
};

const endCall = async (conversationId, io, reason) => {
  const call = activeCalls.get(conversationId);
  if (call) {
    clearTimeout(call.timeout);
    activeCalls.delete(conversationId);
    
    io.to(`user:${call.caller.toString()}`).emit("call:end", { conversationId, reason });
    io.to(`user:${call.receiver.toString()}`).emit("call:end", { conversationId, reason });

    const duration = Math.floor((new Date() - call.startTime) / 1000); // duration in seconds
    await saveCallHistory(conversationId, call, duration);
  }
};

const saveCallHistory = async (conversationId, call, duration) => {
  try {
    let status = "completed";
    if (call.status === "calling" && duration === 0) status = "missed";
    else if (duration === 0) status = "declined";
    else if (duration > 0) status = "completed";

    const isVideo = call.type === "video";
    let textStr = "";
    
    if (status === "missed") {
      textStr = isVideo ? "Missed video call" : "Missed voice call";
    } else {
      textStr = isVideo ? "Video call" : "Voice call";
    }

    const newMessage = await TutorialMessage.create({
      conversationId,
      senderId: call.caller, 
      receiverId: call.receiver,
      type: "call",
      text: textStr,
      metadata: {
        callType: call.type,
        direction: "outgoing", // The direction is determined dynamically on frontend based on initiatedBy
        status: status,
        duration: duration,
        startedAt: call.startTime.toISOString(),
        endedAt: new Date().toISOString(),
        initiatedBy: call.caller
      }
    });
    
    await TutorialConversation.findByIdAndUpdate(conversationId, {
      latestMessage: newMessage._id,
      latestAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to save call history:", error);
  }
};
