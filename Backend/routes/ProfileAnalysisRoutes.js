import express from "express";
const router = express.Router();

import { analyzeProfile } from "../controllers/ProfileAnalysisController.js";
import { auth } from "../middlewares/auth.js";

// All routes require authentication
router.use(auth);

// Analyze student profile against target role
router.post('/analyze', analyzeProfile);

export default router;