import express from "express";
import { getConversations, getMessages, sendMessage, initConversation } from "../../controllers/Tutorials/tutorialChatController.js";
import { verifyTutorialConversationAccess } from "../../middleware/Tutorials/tutorialChatAuth.js";

const router = express.Router();

// Initialize or get conversation for a booked tutor
router.post("/init", initConversation);

// Get all tutorial conversations for the user
router.get("/conversations", verifyTutorialConversationAccess, getConversations);

// Get messages for a specific conversation
router.get("/:conversationId/messages", verifyTutorialConversationAccess, getMessages);

// Send a message
router.post("/:conversationId/messages", verifyTutorialConversationAccess, sendMessage);

export default router;
