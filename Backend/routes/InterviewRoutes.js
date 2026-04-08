import express from "express";
const router = express.Router();

// Import controllers
import { getSignedUrl } from "../controllers/interview.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Interview routes (ElevenLabs AI)
// ********************************************************************************************************

// Get signed URL for ElevenLabs conversation (requires authentication)
router.get("/interview/signed-url", auth, getSignedUrl);

// Public route alternative (if you want to allow without auth)
// router.get("/interview/signed-url", getSignedUrl);

export default router;