import express from "express";
import {
  createBudget,
  getBudgets,
  getBudgetStatus,
} from "../../controllers/Expenses/budgetController.js";
import { verifyToken } from "../../middlewares/Expenses/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/create", createBudget);
router.post("/all", getBudgets);
router.post("/status", getBudgetStatus);

export default router;