import express from "express";
import protect from "../../middlewares/Attendance/authMiddleware.js";
import { allowAuthenticated } from "../../middlewares/Attendance/roleMiddleware.js";
import {
  getAttendanceStats,
  getAttendanceRecords,
  markAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  getStudentAttendance,
} from "../../controllers/Attendance/personalAttendanceController.js";

const router = express.Router();

router.get("/stats", protect, allowAuthenticated, getAttendanceStats);
router.get("/records", protect, allowAuthenticated, getAttendanceRecords);
router.post("/records", protect, allowAuthenticated, markAttendanceRecord);
router.put("/records/:id", protect, allowAuthenticated, updateAttendanceRecord);
router.delete("/records/:id", protect, allowAuthenticated, deleteAttendanceRecord);

/** Legacy path used by UnifiedDashboard */
router.get("/student", protect, allowAuthenticated, getStudentAttendance);

export default router;
