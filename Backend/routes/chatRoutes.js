import express from "express";
import {
  reportConversation,
  getChatAnalytics,
  getChatReports,
  updateUserStatus,
} from "../controllers/chatController.js";
import { chatAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Custom admin checker matching the system's pattern
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  // Fallback check matching adminRoutes.js
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Forbidden: Admin access required." });
};

// Report endpoint requires general auth
router.post("/report", chatAuth, reportConversation);

// Admin operations require chat auth AND admin checks
router.get("/admin/analytics", chatAuth, requireAdmin, getChatAnalytics);
router.get("/admin/reports", chatAuth, requireAdmin, getChatReports);
router.put("/admin/user/:userId/status", chatAuth, requireAdmin, updateUserStatus);

export default router;
