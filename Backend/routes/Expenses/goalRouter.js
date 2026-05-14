import express from "express";
import {
  createGoal,
  getGoals,
  updateSavings,
} from "../controller/goalController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/create", createGoal);
router.post("/all", getGoals);
router.post("/save", updateSavings);

export default router;