import express from "express";
const router = express.Router();

// Import controllers
import {
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOpportunities,
    getMyOpportunities,
} from "../controllers/OpportunityController.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Opportunity routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Post Referral Opportunity (Alumni only)
router.post("/opportunities/create", createOpportunity);

// Update Referral Opportunity (Alumni only - owner)
router.put("/opportunities/:opportunityId", updateOpportunity);

// Close Referral Opportunity (Alumni only - owner)
router.delete("/opportunities/:opportunityId", deleteOpportunity);

// View All Opportunities (Students & Alumni - same college)
router.get("/opportunities", getOpportunities);

// View My Posted Opportunities (Alumni only)
router.get("/my-opportunities", getMyOpportunities);

export default router;