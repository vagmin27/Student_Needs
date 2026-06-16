import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { buildJwtPayload, buildFrontendUserPayload } from "../../utils/Referrals/oauthAdapter.js";
import {
  signup,
  login,
  verifyOtp,
  resendOtp,
  refreshToken,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getStudentData,
} from "../../controllers/Referrals/StudentAuth.js";
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
router.get("/me", auth, getStudentData);

// ================= SOCIAL GOOGLE AUTH =================
router.get(
  "/auth/google",
  (req, res, next) => {
    const role = req.query.role || "student";
    passport.authenticate("google-student", { session: false, scope: ["profile", "email"], state: role })(req, res, next);
  }
);

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google-student", { session: false }, async (err, result, info) => {
    if (err || !result) {
      const errMsg = info?.message || "Google authentication failed";
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/login/student?error=${encodeURIComponent(errMsg)}`
      );
    }
    try {
      const { user, role } = result;
      const jwtPayload = buildJwtPayload(role, user);
      
      const token = jwt.sign(
        jwtPayload,
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
      const refresh = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      user.refreshToken = refresh;
      await user.save();

      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("refreshToken", refresh, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Lax",
        maxAge: 15 * 60 * 1000,
      });

      const frontendPayload = buildFrontendUserPayload(role, user);
      const userParam = encodeURIComponent(JSON.stringify(frontendPayload));

      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/social-success?token=${token}&user=${userParam}`
      );
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// ================= SOCIAL GITHUB AUTH =================
router.get(
  "/auth/github",
  (req, res, next) => {
    const role = req.query.role || "student";
    passport.authenticate("github-student", { session: false, scope: ["user:email"], state: role })(req, res, next);
  }
);

router.get("/auth/github/callback", (req, res, next) => {
  passport.authenticate("github-student", { session: false }, async (err, result, info) => {
    if (err || !result) {
      const errMsg = info?.message || "GitHub authentication failed";
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/login/student?error=${encodeURIComponent(errMsg)}`
      );
    }
    try {
      const { user, role } = result;
      const jwtPayload = buildJwtPayload(role, user);
      
      const token = jwt.sign(
        jwtPayload,
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
      const refresh = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      user.refreshToken = refresh;
      await user.save();

      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("refreshToken", refresh, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Lax",
        maxAge: 15 * 60 * 1000,
      });

      const frontendPayload = buildFrontendUserPayload(role, user);
      const userParam = encodeURIComponent(JSON.stringify(frontendPayload));

      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/social-success?token=${token}&user=${userParam}`
      );
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

export default router;