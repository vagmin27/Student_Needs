import express from "express";
const router = express.Router();

// Import controllers
import {
    addLinkedInUrl,
    updateLinkedInUrl,
    getLinkedInUrl,
    deleteLinkedInUrl,
} from "../../controllers/Referrals/StudentLinkedIn.js";

// Import middleware
import { auth } from "../../middlewares/Referrals/auth.js";

// All routes require authentication
router.use(auth);

// Core CRUD Endpoints
router.post("/linkedin", addLinkedInUrl);
router.put("/linkedin", updateLinkedInUrl);
router.get("/linkedin", getLinkedInUrl);
router.delete("/linkedin", deleteLinkedInUrl);

// Legacy Route Mappings for safety
router.post("/linkedin/upload", updateLinkedInUrl); // Map upload to simple URL update
router.put("/linkedin/url", updateLinkedInUrl);      // Map legacy URL put
router.put("/linkedin/pdf", (req, res) => {          // Disable PDF endpoint
    res.status(410).json({ success: false, message: "LinkedIn PDF uploads are no longer supported. Please add a LinkedIn Profile URL." });
});

export default router;