import express from "express";
import protect from "../../middlewares/Attendance/authMiddleware.js";
import { allowAuthenticated, allowTeacher } from "../../middlewares/Attendance/roleMiddleware.js";
import {
  getTutorSubjects,
  createTutorSubject,
  updateTutorSubject,
  deleteTutorSubject,
  getEnrolledStudents,
  getSessionRecords,
  markSessionAttendance,
  getStudentSummary,
  getStudentHistory,
} from "../../controllers/Attendance/tutorAttendanceController.js";

const router = express.Router();

/** Tutor: subject CRUD */
router.get("/tutor/subjects", protect, allowTeacher, getTutorSubjects);
router.post("/tutor/subjects", protect, allowTeacher, createTutorSubject);
router.put("/tutor/subjects/:id", protect, allowTeacher, updateTutorSubject);
router.delete("/tutor/subjects/:id", protect, allowTeacher, deleteTutorSubject);

/** Tutor: students enrolled via bookings for a subject */
router.get("/tutor/enrolled", protect, allowTeacher, getEnrolledStudents);

/** Tutor: existing marks for a session */
router.get("/tutor/session", protect, allowTeacher, getSessionRecords);

/** Tutor: mark present/absent (upsert) */
router.post("/tutor/session", protect, allowTeacher, markSessionAttendance);

/** Student: read-only summary and history */
router.get("/student/summary", protect, allowAuthenticated, getStudentSummary);
router.get("/student/history", protect, allowAuthenticated, getStudentHistory);

export default router;
