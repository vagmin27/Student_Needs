import express from "express";
import {
  signup,
  login,
  verifyOtp,
  resendOtp,
  refreshToken,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getAlumniData,
} from "../../controllers/Referrals/AlumniAuth.js";
import { auth } from "../../middlewares/Referrals/auth.js";

const router = express.Router();

// ================= LOCAL AUTH ENDPOINTS =================
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/refresh", refreshToken);

// ================= PASSWORD RESET ENDPOINTS =================
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

// ================= USER DATA ENDPOINT =================
router.get("/getAlumniData", auth, getAlumniData);

export default router;