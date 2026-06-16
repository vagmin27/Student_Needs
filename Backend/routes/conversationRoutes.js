import express from "express";
import {
  createOrGetConversation,
  getConversations,
  getConversationById,
  toggleArchiveConversation,
  toggleBlockConversation,
} from "../controllers/conversationController.js";
import { chatAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// All conversation routes require authentication
router.use(chatAuth);

router.post("/conversation", createOrGetConversation);
router.get("/conversations", getConversations);
router.get("/conversation/:id", getConversationById);
router.put("/conversation/:id/archive", toggleArchiveConversation);
router.put("/conversation/:id/block", toggleBlockConversation);

export default router;
