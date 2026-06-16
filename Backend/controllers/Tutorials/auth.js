import passport from "passport";
import jwt from "jsonwebtoken";
import Tutor from "../../models/Tutorials/Tutor.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import Student from "../../models/Referrals/StudentModel.js";
import { getJwtSecret } from "../../utils/jwtSecret.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "../../utils/Referrals/emailService.js";

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
};

const resolveUserFromToken = async (token) => {
  const decoded = jwt.verify(token, getJwtSecret());
  if (!decoded?.id) return null;

  const resolvedRole = (decoded.role || decoded.accountType || "student").toLowerCase();
  let dbUser = null;

  if (resolvedRole === "alumni") {
    dbUser = await Alumni.findById(decoded.id)
      .select("-password")
      .populate("college", "name matchingName")
      .lean();
  } else if (resolvedRole === "tutor" || resolvedRole === "teacher") {
    dbUser = await Tutor.findById(decoded.id).select("-password").lean();
  } else {
    dbUser = await Student.findById(decoded.id).select("-password").lean();
  }

  if (!dbUser) return null;

  return {
    ...dbUser,
    role: resolvedRole,
    accountType: resolvedRole,
  };
};

// 🔐 LOGIN
export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Invalid credentials",
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.login(user, (err) => {
        if (err) return next(err);

        req.session.save((err) => {
          if (err) return next(err);

          return res.status(200).json({
            status: "ok",
            user: user,
          });
        });
      });
    });
  })(req, res, next);
};

export const getUser = async (req, res) => {
  try {
    const token = getBearerToken(req) || req.cookies?.token;

    if (token) {
      try {
        const dbUser = await resolveUserFromToken(token);
        if (dbUser) {
          return res.status(200).json({ user: dbUser });
        }
      } catch (err) {
        if (err.name !== "JsonWebTokenError" && err.name !== "TokenExpiredError") {
          console.error("Error verifying JWT token in getUser:", err.message);
        }
      }
    }

    if (req.isAuthenticated()) {
      return res.status(200).json({ user: req.user });
    }

    if (req.session?.user?.id && req.session?.user?.role === "tutor") {
      const tutor = await Tutor.findById(req.session.user.id).select("-password").lean();
      if (tutor) {
        const sessionToken = jwt.sign(
          { id: tutor._id, role: "tutor" },
          getJwtSecret(),
          { expiresIn: "7d" }
        );
        return res.status(200).json({
          user: { ...tutor, role: "tutor", accountType: "tutor" },
          token: sessionToken,
        });
      }
    }

    return res.status(401).json({ user: null });
  } catch (e) {
    console.error("getUser error:", e.message);
    return res.status(500).json({ user: null, message: "Failed to load user" });
  }
};

// 🚪 LOGOUT
export const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out" });
    });
  });
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.trim().toLowerCase();
    const tutor = await Tutor.findOne({ email });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Account not found with this email.",
      });
    }

    // Generate reset OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tutor.otp = hashOtp(otp);
    tutor.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await tutor.save();

    await sendResetPasswordEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "A password reset verification OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Request failed",
      error: error.message,
    });
  }
};

// ================= VERIFY RESET OTP =================
export const verifyResetOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    email = email.trim().toLowerCase();
    const tutor = await Tutor.findOne({ email });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!tutor.otp || !tutor.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No reset request pending.",
      });
    }

    if (new Date() > tutor.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Reset OTP has expired. Please request a new one.",
      });
    }

    const hashedInputOtp = hashOtp(otp.trim());
    if (tutor.otp !== hashedInputOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });

  } catch (error) {
    console.error("VERIFY RESET OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    let { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    email = email.trim().toLowerCase();
    const tutor = await Tutor.findOne({ email });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!tutor.otp || !tutor.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Session expired or reset request not found.",
      });
    }

    if (new Date() > tutor.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP session has expired. Please restart forgot password process.",
      });
    }

    const hashedInputOtp = hashOtp(otp.trim());
    if (tutor.otp !== hashedInputOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP credentials.",
      });
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    tutor.password = hashedPassword;
    tutor.otp = null;
    tutor.otpExpiry = null;
    await tutor.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
