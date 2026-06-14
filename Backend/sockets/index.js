import { Server } from "socket.io";
import { socketAuthMiddleware } from "./auth.js";
import { registerChatHandlers } from "./chat.js";
import { registerTutorChatHandlers } from "../socket/socketServer.js";
import { registerTutorCallHandlers } from "./tutorialCallSocket.js";

export const onlineUsers = new Map();

let io;

export const initSocket = (server) => {
  const allowedOrigins = process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:8080"];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // Allow polling fallback
    pingInterval: 15000,
    pingTimeout: 30000,
  });

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.user?.id || socket.user?._id;
    const stringUserId = userId?.toString();
    const timestamp = new Date().toISOString();

    console.log(`[SOCKET CONNECT] timestamp=${timestamp} socketId=${socket.id} userId=${stringUserId}`);

    if (stringUserId) {
      console.log(`[REGISTER USER] timestamp=${new Date().toISOString()} socketId=${socket.id} userId=${stringUserId}`);
      
      socket.join(`user:${stringUserId}`);
      console.log(`[JOIN USER ROOM] timestamp=${new Date().toISOString()} socketId=${socket.id} userId=${stringUserId} room=user:${stringUserId}`);

      if (!onlineUsers.has(stringUserId)) {
        onlineUsers.set(stringUserId, new Set());
      }
      const userSockets = onlineUsers.get(stringUserId);
      const isFirstConnection = userSockets.size === 0;
      userSockets.add(socket.id);

      // Print map for Phase 4
      const mapState = {};
      for (const [id, sockets] of onlineUsers.entries()) {
        mapState[id] = Array.from(sockets);
      }
      console.log(`[ONLINE USERS MAP] timestamp=${new Date().toISOString()}`, JSON.stringify(mapState));

      console.log(`[PRESENCE ONLINE] user: ${stringUserId}`);

      if (isFirstConnection) {
        // Emit BOTH legacy and new events
        io.emit("userOnline", { userId: stringUserId });
        io.emit("user_status", { userId: stringUserId, status: "online", lastSeen: new Date() });
      }
    }

    // Role-based rooms
    const role = socket.user?.role;
    if (role) {
      socket.join(`role:${role}`);
    }

    // Register Chat Handlers
    registerChatHandlers(io, socket);
    registerTutorChatHandlers(io, socket);
    registerTutorCallHandlers(io, socket);

    socket.on("get_online_users", (cb) => {
      if (typeof cb === "function") {
        cb([...onlineUsers.keys()]);
      }
    });

    socket.on("disconnect", () => {
      const ts = new Date().toISOString();
      console.log(`[SOCKET DISCONNECT] timestamp=${ts} socketId=${socket.id} userId=${stringUserId}`);
      
      if (stringUserId && onlineUsers.has(stringUserId)) {
        const userSockets = onlineUsers.get(stringUserId);
        userSockets.delete(socket.id);

        const mapState = {};
        for (const [id, sockets] of onlineUsers.entries()) {
          mapState[id] = Array.from(sockets);
        }
        console.log(`[ONLINE USERS MAP] timestamp=${new Date().toISOString()}`, JSON.stringify(mapState));

        if (userSockets.size === 0) {
          onlineUsers.delete(stringUserId);
          console.log(`[PRESENCE OFFLINE] user: ${stringUserId}`);
          // Emit BOTH legacy and new events
          io.emit("userOffline", { userId: stringUserId, lastSeen: new Date() });
          io.emit("user_status", { userId: stringUserId, status: "offline", lastSeen: new Date() });
        }
      }
    });
  });

  // Stale Socket Cleanup Interval
  setInterval(() => {
    for (const [userId, sockets] of onlineUsers.entries()) {
      let activeFound = false;
      for (const socketId of sockets) {
        if (io.sockets.sockets.has(socketId)) {
          activeFound = true;
        } else {
          sockets.delete(socketId); // Remove stale socket
        }
      }
      if (!activeFound || sockets.size === 0) {
        onlineUsers.delete(userId);
        console.log(`[PRESENCE OFFLINE] (Cleanup) user: ${userId}`);
        io.emit("userOffline", { userId, lastSeen: new Date() });
        io.emit("user_status", { userId, status: "offline", lastSeen: new Date() });
      }
    }
  }, 60000); // Check every 60 seconds

  console.log("✅ WebSocket Server Initialized");
  return io;
};

// Getter for the singleton instance (useful for emitting from Express controllers)
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
