import express from "express";
import { delProfile } from "../../controllers/Tutorials/accountSetting.js";

const router = express.Router();

// ✅ DELETE account (REST standard)
router.delete("/deleteAccount/:id", delProfile);

export default router;