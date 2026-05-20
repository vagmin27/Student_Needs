import express from "express";
import protect from "../../middlewares/Attendance/authMiddleware.js";
import { allowTeacher } from "../../middlewares/Attendance/roleMiddleware.js";

import {
  addStudent,
  deleteStudent,
  getSingleStudent,
  getStudents,
} from "../../controllers/Attendance/studentController.js";

const router = express.Router();


// ✅ ADD STUDENT
router.post(
  "/form/insert",
  protect,
  allowTeacher,
  addStudent
);


// ✅ GET ALL STUDENTS
router.get(
  "/read",
  protect,
  allowTeacher,
  getStudents
);


// ✅ GET SINGLE STUDENT
router.get(
  "/remove/getStudent/:registerNumber",
  protect,
  allowTeacher,
  getSingleStudent
);


// ✅ DELETE STUDENT
router.delete(
  "/remove/delete/:registerNumber",
  protect,
  allowTeacher,
  deleteStudent
);

export default router;