import express from "express";
const router = express.Router();

// Import controllers
import {
    getChats,
    getMessages,
    sendMessage,
    markRead,
    uploadAttachment,
    downloadAttachment,
    editMessage,
    deleteMessage
} from "../../controllers/Referrals/ChatController.js";

// Import middleware
import { auth } from "../../middlewares/Referrals/auth.js";

// Secure attachment route (Uses auth middleware inside the route group)
router.get("/chats/attachments/:fileName", auth, downloadAttachment);

// Authenticated route group
router.use(auth);

// Conversations CRUD
router.get("/chats", getChats);
router.get("/chats/:chatId/messages", getMessages);
router.post("/chats/:chatId/messages", sendMessage);
router.post("/chats/:chatId/read", markRead);
router.post("/chats/:chatId/upload", uploadAttachment);
router.put("/chats/messages/:messageId", editMessage);
router.delete("/chats/messages/:messageId", deleteMessage);

export default router;
