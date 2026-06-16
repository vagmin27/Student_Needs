import express from "express";
import {
  sendMessage,
  getMessages,
  markMessageSeen,
  editMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import { chatAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// All message routes require authentication
router.use(chatAuth);

router.post("/message", sendMessage);
router.get("/messages/:conversationId", getMessages);
router.put("/message/seen/:messageId", markMessageSeen);
router.put("/message/edit/:messageId", editMessage);
router.delete("/message/:messageId", deleteMessage);

export default router;
