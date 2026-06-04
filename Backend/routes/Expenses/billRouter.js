import express from "express";
import {
  createBill,
  getBills,
  editBill,
  deleteBill,
  payBill,
  getBillHistory,
  getDashboardSummary
} from "../../controllers/Expenses/billController.js";
import { verifyToken } from "../../middlewares/Expenses/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/bills", createBill);
router.get("/bills", getBills);
router.put("/bills/:id", editBill);
router.delete("/bills/:id", deleteBill);
router.patch("/bills/:id/pay", payBill);
router.get("/bill-history", getBillHistory);
router.get("/dashboard/expense-summary", getDashboardSummary);

export default router;
