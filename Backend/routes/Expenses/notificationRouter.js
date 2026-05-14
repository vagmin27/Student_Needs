import express from "express";
import { updateSettings } from "../controller/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/settings", updateSettings);

export default router;