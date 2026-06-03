import bcrypt from "bcrypt";
import crypto from "crypto";
import Alumni from "../../models/Referrals/AlumniModel.js";
import College from "../../models/Referrals/CollegeModel.js";
import jwt from "jsonwebtoken";
import { handleAuthSuccess, generateToken, generateRefreshToken } from "../../utils/Referrals/tokenGenerator.js";
import dotenv from "dotenv";
import validator from "validator";
import { sendOtpEmail, sendWelcomeEmail, sendResetPasswordEmail } from "../../utils/Referrals/emailService.js";

dotenv.config();

// ================= VALIDATION HELPERS =================
function validateEmail(email) {
  return validator.isEmail(email);
}

function validatePasswordStrength(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      password,
      collegeName,
      company,
      jobTitle,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !collegeName) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim().toLowerCase();

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!validatePasswordStrength(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      });
    }

    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email });

    if (existingAlumni) {
      if (existingAlumni.isVerified) {
        return res.status(409).json({
          success: false,
          message: "Alumni already exists. Please login.",
        });
      }

      // If unverified, let them re-register/update details and send fresh OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      existingAlumni.firstName = firstName;
      existingAlumni.lastName = lastName;
      existingAlumni.password = hashedPassword;
      existingAlumni.company = company || "";
      existingAlumni.jobTitle = jobTitle || "";

      // Find or create college
      const matchingName = collegeName.replace(/\s+/g, "").toLowerCase();
      let college = await College.findOne({ matchingName });
      if (!college) {
        college = await College.create({
          name: collegeName,
          matchingName,
          Student: [],
          Alumni: [],
        });
      }
      existingAlumni.college = college._id;

      // OTP Generation
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existingAlumni.otp = hashOtp(otp);
      existingAlumni.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      await existingAlumni.save();
      await sendOtpEmail(email, otp);

      return res.status(200).json({
        success: true,
        message: "Signup details updated. A fresh verification OTP has been sent to your email.",
      });
    }

    // Find or create college
    const matchingName = collegeName.replace(/\s+/g, "").toLowerCase();
    let college = await College.findOne({ matchingName });

    if (!college) {
      college = await College.create({
        name: collegeName,
        matchingName,
        Student: [],
        Alumni: [],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP Generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtpVal = hashOtp(otp);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const alumni = await Alumni.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: "alumni",
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
      college: college._id,
      company: company || "",
      jobTitle: jobTitle || "",
      isVerified: false,
      otp: hashedOtpVal,
      otpExpiry,
      provider: "local",
    });

    college.Alumni.push(alumni._id);
    await college.save();

    await sendOtpEmail(email, otp);

    return res.status(201).json({
      success: true,
      message: "Registration successful. A 6-digit verification OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("ALUMNI SIGNUP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Alumni registration failed",
      error: error.message,
    });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    email = email.trim().toLowerCase();
    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni account not found",
      });
    }

    if (alumni.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Alumni account is already verified. Please login.",
      });
    }

    if (!alumni.otp || !alumni.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No pending verification found or OTP expired.",
      });
    }

    if (new Date() > alumni.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    const hashedInputOtp = hashOtp(otp.trim());
    if (alumni.otp !== hashedInputOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    alumni.isVerified = true;
    alumni.otp = null;
    alumni.otpExpiry = null;
    await alumni.save();

    try {
      await sendWelcomeEmail(alumni.email, alumni.firstName);
    } catch (mailErr) {
      console.error("Error sending welcome email to alumni:", mailErr);
    }

    return res.status(200).json({
      success: true,
      message: "Alumni email verified successfully! You can now log in.",
    });

  } catch (error) {
    console.error("ALUMNI OTP VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

// ================= RESEND OTP =================
export const resendOtp = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.trim().toLowerCase();
    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni account not found",
      });
    }

    if (alumni.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified. Please login.",
      });
    }

    // Cooldown check (60s)
    if (alumni.otpExpiry) {
      const remainingTimeMs = alumni.otpExpiry.getTime() - Date.now();
      if (remainingTimeMs > 4 * 60 * 1000) {
        return res.status(429).json({
          success: false,
          message: "Please wait at least 60 seconds before requesting a new OTP.",
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    alumni.otp = hashOtp(otp);
    alumni.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await alumni.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "A fresh verification OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("ALUMNI RESEND OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    email = email.trim().toLowerCase();

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const alumni = await Alumni.findOne({ email }).populate("college", "name matchingName");

    if (!alumni) {
      return res.status(401).json({
        success: false,
        message: "Alumni not registered",
      });
    }

    if (alumni.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: `This email is registered via ${alumni.provider} authentication. Please login using your social account.`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, alumni.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Gate unverified accounts
    if (!alumni.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      alumni.otp = hashOtp(otp);
      alumni.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      await alumni.save();

      await sendOtpEmail(alumni.email, otp);

      return res.status(403).json({
        success: false,
        isVerified: false,
        message: "Your alumni account email is unverified. We have sent a fresh OTP verification code to your email. Please verify to log in.",
      });
    }

    return handleAuthSuccess(alumni, res, "Alumni logged in successfully");

  } catch (error) {
    console.error("ALUMNI LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ================= REFRESH TOKEN =================
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired",
      });
    }

    const alumni = await Alumni.findById(decoded.id);

    if (!alumni || alumni.refreshToken !== token) {
      return res.status(403).json({
        success: false,
        message: "Refresh token is revoked or reuse detected",
      });
    }

    // Rotate tokens
    const newAccessToken = generateToken(alumni);
    const newRefreshToken = generateRefreshToken(alumni);

    alumni.refreshToken = newRefreshToken;
    await alumni.save();

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (error) {
    console.error("ALUMNI REFRESH TOKEN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh token",
      error: error.message,
    });
  }
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
    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni account not found with this email.",
      });
    }

    if (alumni.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: `This account uses ${alumni.provider} authentication. You cannot reset password directly.`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    alumni.otp = hashOtp(otp);
    alumni.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await alumni.save();

    await sendResetPasswordEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "A password reset verification OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("ALUMNI FORGOT PASSWORD ERROR:", error);
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
    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni account not found",
      });
    }

    if (!alumni.otp || !alumni.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No reset request pending.",
      });
    }

    if (new Date() > alumni.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Reset OTP has expired. Please request a new one.",
      });
    }

    const hashedInputOtp = hashOtp(otp.trim());
    if (alumni.otp !== hashedInputOtp) {
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
    console.error("ALUMNI VERIFY RESET OTP ERROR:", error);
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
    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    if (!alumni.otp || !alumni.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Session expired or reset request not found.",
      });
    }

    if (new Date() > alumni.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP session has expired. Please restart forgot password process.",
      });
    }

    const hashedInputOtp = hashOtp(otp.trim());
    if (alumni.otp !== hashedInputOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP credentials.",
      });
    }

    if (!validatePasswordStrength(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    alumni.password = hashedPassword;
    alumni.otp = null;
    alumni.otpExpiry = null;
    await alumni.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.error("ALUMNI RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

// ================= GET ALUMNI DATA =================
export const getAlumniData = async (req, res) => {
  try {
    const alumniId = req.user.id;

    const alumni = await Alumni.findById(alumniId)
      .select("-password")
      .populate("college", "name matchingName");

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: alumni,
    });

  } catch (error) {
    console.error("Get Alumni Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch alumni data",
    });
  }
};