import express from "express";
const router = express.Router();

// Import controllers
import {
    uploadResume,
    updateResume,
    getResume,
    deleteResume,
} from "../controllers/StudentResume.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Student Resume routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Upload Resume (first time)
router.post("/resume/upload", uploadResume);

// Replace/Update Resume
router.put("/resume/update", updateResume);

// Get Resume Details
router.get("/resume", getResume);

// Delete Resume
router.delete("/resume", deleteResume);

export default router;