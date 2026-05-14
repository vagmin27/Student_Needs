import express from "express";
import {
  createExpense,
  deleteExpense,
  getCategoryExpense,
  getAllExpenses,
  getSummary,
  getRecentExpenses,
  getMonthlyExpenses,
  emailSender,
} from "../controller/expenseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/addExpense", createExpense);
router.post("/deleteExpense", deleteExpense);
router.get("/categoryExpense", getCategoryExpense);
router.post("/allExpenses", getAllExpenses);
router.post("/sendEmail", emailSender);
router.post("/summary", getSummary);
router.post("/recent", getRecentExpenses);
router.post("/monthly", getMonthlyExpenses);

export default router;