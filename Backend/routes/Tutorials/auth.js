import express from "express";
import { login, getUser, logOut, forgotPassword, verifyResetOtp, resetPassword } from "../../controllers/Tutorials/auth.js";

const router = express.Router();

// ✅ LOGIN
router.post("/login", login);

// ✅ GET CURRENT USER (IMPORTANT)
router.get("/user", getUser);

// ✅ LOGOUT
router.post("/logout", logOut);

// ✅ FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;