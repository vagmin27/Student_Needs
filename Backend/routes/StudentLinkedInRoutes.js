import express from "express";
const router = express.Router();

// Import controllers
import {
    uploadLinkedIn,
    updateLinkedInLink,
    updateLinkedInPdf,
    getLinkedIn,
    deleteLinkedIn,
} from "../controllers/StudentLinkedIn.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Student LinkedIn routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Upload LinkedIn PDF with optional URL (first time)
router.post("/linkedin/upload", uploadLinkedIn);

// Update only LinkedIn URL
router.put("/linkedin/url", updateLinkedInLink);

// Update only LinkedIn PDF
router.put("/linkedin/pdf", updateLinkedInPdf);

// Get LinkedIn PDF
router.get("/linkedin", getLinkedIn);

// Delete LinkedIn PDF
router.delete("/linkedin", deleteLinkedIn);

export default router;