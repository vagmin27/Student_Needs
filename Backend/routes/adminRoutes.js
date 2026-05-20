import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Basic mock auth middleware for admin
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // In a real app, this should decode a JWT and verify the user role === 'admin'.
  // For demonstration/scalability setup, we check if a token exists.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ success: false, message: "Forbidden: Admin access required." });
  }
  next();
};

router.get("/diagnostics", requireAdmin, async (req, res) => {
  const memory = process.memoryUsage();
  
  // Format memory to MB
  const formatMemory = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const diagnostics = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    memory: {
      rss: formatMemory(memory.rss),
      heapTotal: formatMemory(memory.heapTotal),
      heapUsed: formatMemory(memory.heapUsed),
      external: formatMemory(memory.external),
    },
    database: {
      state: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
    }
  };

  res.status(200).json({ success: true, diagnostics });
});

export default router;
