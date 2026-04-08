import express from "express";
const router = express.Router();

// Import controllers
import {
    updateProfile,
    getProfile,
} from "../controllers/AlumniProfile.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// All routes require authentication
router.use(auth);

// Create / Update Profile
router.put("/profile", updateProfile);

// Get Own Profile
router.get("/profile", getProfile);

export default router;