import bcrypt from "bcrypt";
import crypto from "crypto";
import Student from "../../models/Referrals/StudentModel.js";
import College from "../../models/Referrals/CollegeModel.js";
import jwt from "jsonwebtoken";
import { handleAuthSuccess, generateToken, generateRefreshToken } from "../../utils/Referrals/tokenGenerator.js";
import dotenv from "dotenv";
import validator from "validator";
import { calculateProfileCompleteness } from "../../utils/Referrals/calculateProfileScore.js";
import { sendOtpEmail, sendWelcomeEmail, sendResetPasswordEmail } from "../../utils/Referrals/emailService.js";

dotenv.config();

// ================= VALIDATION HELPERS =================
function validateEmail(email) {
  return validator.isEmail(email);
}

function validatePasswordStrength(password) {
  // Min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
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
      accountType,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !collegeName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
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

    // Check if user exists
    const existingStudent = await Student.findOne({ email });

    // Handle existing registered user
    if (existingStudent) {
      if (existingStudent.isVerified) {
        return res.status(409).json({
          success: false,
          message: "Email already registered. Please login.",
        });
      }
      
      // If unverified, we let them signup again and update details/send new OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      existingStudent.firstName = firstName;
      existingStudent.lastName = lastName;
      existingStudent.password = hashedPassword;
      existingStudent.accountType = accountType || "student";
      
      // Update college if different
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
      existingStudent.college = college._id;

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existingStudent.otp = hashOtp(otp);
      existingStudent.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      existingStudent.profileCompleteness = calculateProfileCompleteness(existingStudent);
      await existingStudent.save();

      // Send OTP
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

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtpVal = hashOtp(otp);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const student = await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType || "student",
      college: college._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
      isVerified: false,
      otp: hashedOtpVal,
      otpExpiry,
      provider: "local",
    });

    college.Student.push(student._id);
    await college.save();

    student.profileCompleteness = calculateProfileCompleteness(student);
    await student.save();

    // Send verification email
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      success: true,
      message: "Registration successful. A 6-digit verification OTP has been sent to your email.",
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: err.message,
    });
  }
};

// ================= OTP VERIFICATION =================
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
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (student.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Please login.",
      });
    }

    if (!student.otp || !student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No pending verification found or OTP expired.",
      });
    }

    if (new Date() > student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    const hashedInputOtp = hashOtp(otp.trim());
    if (student.otp !== hashedInputOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please try again.",
      });
    }

    // Verification Success
    student.isVerified = true;
    student.otp = null;
    student.otpExpiry = null;
    await student.save();

    // Send Welcome Email
    try {
      await sendWelcomeEmail(student.email, student.firstName);
    } catch (mailErr) {
      console.error("Error sending welcome email:", mailErr);
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });

  } catch (error) {
    console.error("OTP VERIFY ERROR:", error);
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
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (student.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified. Please login.",
      });
    }

    // Cooldown check (optional: 60s cooldown)
    if (student.otpExpiry) {
      const remainingTimeMs = student.otpExpiry.getTime() - Date.now();
      // If expiry is between 4 and 5 mins (meaning it was created < 60s ago)
      if (remainingTimeMs > 4 * 60 * 1000) {
        return res.status(429).json({
          success: false,
          message: "Please wait at least 60 seconds before requesting a new OTP.",
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    student.otp = hashOtp(otp);
    student.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await student.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "A fresh verification OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
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

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Student not registered",
      });
    }

    if (student.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: `This email is registered via ${student.provider} authentication. Please login using your social account.`,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, student.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Gate unverified users from logging in
    if (!student.isVerified) {
      // Auto-trigger a new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      student.otp = hashOtp(otp);
      student.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      await student.save();

      await sendOtpEmail(student.email, otp);

      return res.status(403).json({
        success: false,
        isVerified: false,
        message: "Your account email is unverified. We have sent a fresh OTP verification code to your email. Please verify to log in.",
      });
    }

    return handleAuthSuccess(student, res, "Login successful");

  } catch (error) {
    console.error("LOGIN ERROR:", error);
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

    const student = await Student.findById(decoded.id);

    if (!student || student.refreshToken !== token) {
      return res.status(403).json({
        success: false,
        message: "Refresh token is revoked or reuse detected",
      });
    }

    // Rotate Tokens (Refresh Token Rotation)
    const newAccessToken = generateToken(student);
    const newRefreshToken = generateRefreshToken(student);

    student.refreshToken = newRefreshToken;
    await student.save();

    const isProduction = process.env.NODE_ENV === "production";

    // Update Cookies
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
    console.error("REFRESH TOKEN ERROR:", error);
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
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Account not found with this email.",
      });
    }

    if (student.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: `This account uses ${student.provider} authentication. You cannot reset password directly.`,
      });
    }

    // Generate reset OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    student.otp = hashOtp(otp);
    student.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await student.save();

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
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!student.otp || !student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No reset request pending.",
      });
    }

    if (new Date() > student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Reset OTP has expired. Please request a new one.",
      });
    }

    const hashedInputOtp = hashOtp(otp.trim());
    if (student.otp !== hashedInputOtp) {
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
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!student.otp || !student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Session expired or reset request not found.",
      });
    }

    if (new Date() > student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP session has expired. Please restart forgot password process.",
      });
    }

    const hashedInputOtp = hashOtp(otp.trim());
    if (student.otp !== hashedInputOtp) {
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
    student.password = hashedPassword;
    student.otp = null;
    student.otpExpiry = null;
    await student.save();

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

// ================= GET STUDENT DATA =================
export const getStudentData = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId)
      .select("-password")
      .populate("college", "name matchingName");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });

  } catch (error) {
    console.error("GET STUDENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student data",
      error: error.message,
    });
  }
};
