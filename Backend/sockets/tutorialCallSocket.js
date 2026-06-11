import TutorialMessage from "../models/Tutorials/TutorialMessage.js";
import TutorialConversation from "../models/Tutorials/TutorialConversation.js";

const activeCalls = new Map(); // conversationId -> { caller, receiver, startTime, timeout, type }

export const registerTutorCallHandlers = (io, socket) => {
  const userId = socket.user?.id || socket.user?._id;

  // Initialize a call
  socket.on("call:start", async ({ conversationId, receiverId, type = "video" }) => {
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

      // 30 seconds timeout if not answered
      const timeout = setTimeout(async () => {
        const call = activeCalls.get(conversationId);
        if (call && call.status === "calling") {
          activeCalls.delete(conversationId);
          
          io.to(call.caller.toString()).emit("call:timeout", { conversationId });
          io.to(call.receiver.toString()).emit("call:missed", { conversationId });
          io.to(call.caller.toString()).emit("call:end", { conversationId, reason: "No answer" });
          io.to(call.receiver.toString()).emit("call:end", { conversationId, reason: "No answer" });
          
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
        status: "calling"
      });

      // Emit incoming call to receiver
      io.to(receiverId.toString()).emit("call:incoming", {
        conversationId,
        callerId: userId,
        type,
        callerInfo: {
          name: socket.user.name,
          role: socket.user.role,
        }
      });
    } catch (err) {
      console.error("Error starting call:", err);
    }
  });

  socket.on("call:accepted", ({ conversationId }) => {
    const call = activeCalls.get(conversationId);
    if (call && call.receiver.toString() === userId.toString()) {
      clearTimeout(call.timeout); // Clear the 30-second timeout when answered
      call.status = "in_progress";
      io.to(call.caller.toString()).emit("call:accepted", { conversationId });
    }
  });

  socket.on("call:declined", async ({ conversationId }) => {
    const call = activeCalls.get(conversationId);
    if (call && call.receiver.toString() === userId.toString()) {
      clearTimeout(call.timeout);
      activeCalls.delete(conversationId);
      io.to(call.caller.toString()).emit("call:declined", { conversationId });
      
      // Save history
      await saveCallHistory(conversationId, call, 0);
    }
  });

  socket.on("call:offer", ({ conversationId, offer }) => {
    const call = activeCalls.get(conversationId);
    if (call) {
      const targetId = call.caller.toString() === userId.toString() ? call.receiver : call.caller;
      io.to(targetId.toString()).emit("call:offer", { conversationId, offer });
    }
  });

  socket.on("call:answer", ({ conversationId, answer }) => {
    const call = activeCalls.get(conversationId);
    if (call) {
      const targetId = call.caller.toString() === userId.toString() ? call.receiver : call.caller;
      io.to(targetId.toString()).emit("call:answer", { conversationId, answer });
    }
  });

  socket.on("call:ice_candidate", ({ conversationId, candidate }) => {
    const call = activeCalls.get(conversationId);
    if (call) {
      const targetId = call.caller.toString() === userId.toString() ? call.receiver : call.caller;
      io.to(targetId.toString()).emit("call:ice_candidate", { conversationId, candidate });
    }
  });

  socket.on("call:end", async ({ conversationId }) => {
    await endCall(conversationId, io, "Call ended by user");
  });

  socket.on("disconnect", () => {
    activeCalls.forEach(async (call, convId) => {
      if (call.caller.toString() === userId.toString() || call.receiver.toString() === userId.toString()) {
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
    
    io.to(call.caller.toString()).emit("call:end", { conversationId, reason });
    io.to(call.receiver.toString()).emit("call:end", { conversationId, reason });

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
