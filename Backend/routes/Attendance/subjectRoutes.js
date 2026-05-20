import express from "express";
import protect from "../../middlewares/Attendance/authMiddleware.js";
import { allowTeacher } from "../../middlewares/Attendance/roleMiddleware.js";

import {
  addSubject,
  getSubjects,
} from "../../controllers/Attendance/subjectController.js";

const router = express.Router();

router.post("/subjects", protect, allowTeacher, addSubject);

router.get("/subjects", protect, allowTeacher, getSubjects);

export default router;