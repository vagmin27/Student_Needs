import express from "express";
import {
  submitMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} from "../controllers/contactController.js";

const router = express.Router();

// Simple mock admin check middleware matching adminRoutes.js
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required.",
    });
  }
  next();
};

// Public route to submit messages
router.post("/", submitMessage);

// Admin routes
router.get("/", requireAdmin, getMessages);
router.patch("/:id/read", requireAdmin, markAsRead);
router.delete("/:id", requireAdmin, deleteMessage);

export default router;
