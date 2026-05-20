import express from "express";
import { updateSettings } from "../../controllers/Expenses/notificationController.js";
import { verifyToken } from "../../middlewares/Expenses/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/settings", updateSettings);

export default router;