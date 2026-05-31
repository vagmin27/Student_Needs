import express from "express";
const router = express.Router();

// Import controllers
import {
    updateProfile,
    getProfile,
} from "../../controllers/Referrals/AlumniProfile.js";

import {
    uploadProfileImage,
    removeProfileImage,
} from "../../controllers/Referrals/ApplicationController.js";

// Import middleware
import { auth } from "../../middlewares/Referrals/auth.js";

// All routes require authentication
router.use(auth);

// Create / Update Profile
router.put("/profile", updateProfile);

// Get Own Profile
router.get("/profile", getProfile);

// Profile image upload
router.post("/profile/image", uploadProfileImage);

// Profile image removal
router.delete("/profile/image", removeProfileImage);

export default router;