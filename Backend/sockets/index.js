import { Server } from "socket.io";
import { socketAuthMiddleware } from "./auth.js";
import { registerChatHandlers } from "./chat.js";

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
  });

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    // Automatically join a room for this specific user
    const userId = socket.user.id || socket.user._id;
    if (userId) {
      socket.join(userId);
    }

    // Role-based rooms
    const role = socket.user.role;
    if (role) {
      socket.join(`role:${role}`);
    }

    // Register Chat Handlers
    registerChatHandlers(io, socket);
  });

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
