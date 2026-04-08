import express from "express";
const router = express.Router();

// Import controllers
import {
    updateProfile,
    getProfile,
    getProfileStatus,
} from "../controllers/StudentProfile.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Student Profile routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Create / Update Profile
router.put("/profile", updateProfile);

// Get Own Profile
router.get("/profile", getProfile);

// Get Profile Completion Status
router.get("/profile/status", getProfileStatus);

export default router;