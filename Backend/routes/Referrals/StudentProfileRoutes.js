import express from "express";
const router = express.Router();

// Import controllers
import {
    updateProfile,
    getProfile,
    getProfileStatus,
} from "../../controllers/Referrals/StudentProfile.js";

import {
    uploadProfileImage,
    removeProfileImage,
} from "../../controllers/Referrals/ApplicationController.js";

// Import middleware
import { auth } from "../../middlewares/Referrals/auth.js";

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

// Profile image upload
router.post("/profile/image", uploadProfileImage);

// Profile image removal
router.delete("/profile/image", removeProfileImage);

export default router;