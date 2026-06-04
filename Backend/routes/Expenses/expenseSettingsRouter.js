import express from "express";
import { getExpenseSettings, updateExpenseSettings } from "../../controllers/Expenses/expenseSettingsController.js";
import { verifyToken } from "../../middlewares/Expenses/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getExpenseSettings);
router.put("/", updateExpenseSettings);

export default router;
