import express from "express";
import {
  createGoal,
  getGoals,
  updateSavings,
} from "../../controllers/Expenses/goalController.js";
import { verifyToken } from "../../middlewares/Expenses/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/create", createGoal);
router.post("/all", getGoals);
router.post("/save", updateSavings);

export default router;