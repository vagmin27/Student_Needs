import express from "express";
const router = express.Router();

// Import controllers
import {
    addPortfolioUrl,
    updatePortfolioUrl,
    getPortfolioUrl,
    deletePortfolioUrl,
} from "../../controllers/Referrals/StudentPortfolio.js";

// Import middleware
import { auth } from "../../middlewares/Referrals/auth.js";

// All routes require authentication
router.use(auth);

// CRUD routes
router.post("/portfolio", addPortfolioUrl);
router.put("/portfolio", updatePortfolioUrl);
router.get("/portfolio", getPortfolioUrl);
router.delete("/portfolio", deletePortfolioUrl);

export default router;
