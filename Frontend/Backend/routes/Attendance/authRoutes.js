import express from "express";
import protect from "../../middlewares/Attendance/authMiddleware.js";
import { allowTeacher } from "../../middlewares/Attendance/roleMiddleware.js";
import {
  registerUser,
  loginUser,
} from "../../controllers/Attendance/authController.js";

const router = express.Router();


// ✅ REGISTER ROUTE
router.post("/register", registerUser);


// ✅ LOGIN ROUTE
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.get(
  "/teacher-only",
  protect,
  allowTeacher,
  (req, res) => {
    res.json({
      message: "Welcome Teacher",
    });
  }
);

export default router;