import express from "express";
import protect from "../../middlewares/Attendance/authMiddleware.js";
import { allowAuthenticated } from "../../middlewares/Attendance/roleMiddleware.js";
import {
  getMySubjects,
  createMySubject,
  updateMySubject,
  deleteMySubject,
} from "../../controllers/Attendance/personalAttendanceController.js";

const router = express.Router();

router.get("/subjects", protect, allowAuthenticated, getMySubjects);
router.post("/subjects", protect, allowAuthenticated, createMySubject);
router.put("/subjects/:id", protect, allowAuthenticated, updateMySubject);
router.delete("/subjects/:id", protect, allowAuthenticated, deleteMySubject);

export default router;
