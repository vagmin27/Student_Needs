import express from "express";
const router = express.Router();

// Import controllers
import {
    addGithubUrl,
    updateGithubUrl,
    getGithubUrl,
    deleteGithubUrl,
} from "../controllers/StudentgithubUrl.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Student GitHub URL routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Add GitHub URL (first time)
router.post("/github", addGithubUrl);

// Update GitHub URL
router.put("/github", updateGithubUrl);

// Get GitHub URL
router.get("/github", getGithubUrl);

// Delete GitHub URL
router.delete("/github", deleteGithubUrl);

export default router;