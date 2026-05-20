import express from "express";
const router = express.Router();

import { getRecommendedOpportunities } from "../../controllers/Referrals/RecommendationController.js";
import { auth } from "../../middlewares/Referrals/auth.js";

// All routes require authentication
router.use(auth);

// Get personalized AI recommendations for Student
router.get("/recommendations/opportunities", getRecommendedOpportunities);

export default router;
