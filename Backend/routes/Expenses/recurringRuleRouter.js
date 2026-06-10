import express from "express";
import {
  createRecurringRule,
  getRecurringRules,
  updateRecurringRule,
  deleteRecurringRule,
} from "../../controllers/Expenses/recurringRuleController.js";
import { verifyToken } from "../../middlewares/Expenses/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createRecurringRule);
router.get("/", getRecurringRules);
router.put("/:id", updateRecurringRule);
router.delete("/:id", deleteRecurringRule);

export default router;
