// import bcrypt from "bcrypt";
// import Student from "../../models/Referrals/StudentModel.js";
import bcrypt from "bcrypt";
import Student from "../../models/Referrals/StudentModel.js";
import College from "../../models/Referrals/CollegeModel.js";
import jwt from "jsonwebtoken";
import { handleAuthSuccess } from "../../utils/Referrals/tokenGenerator.js";
import dotenv from "dotenv";
import validator from "validator";
import { calculateProfileCompleteness } from "../../utils/Referrals/calculateProfileScore.js";

dotenv.config();

// ================= VALIDATION =================
function validateEmail(email) {
  return validator.isEmail(email);
}

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {


    console.log("REQ BODY:", req.body);

    let {
      firstName,
      lastName,
      email,
      password,
      accountType,
    } = req.body;

    // ================= REQUIRED FIELD VALIDATION =================

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ================= CLEAN INPUT =================

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim().toLowerCase();

    // ================= EMAIL VALIDATION =================

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ================= PASSWORD VALIDATION =================

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ================= CHECK EXISTING STUDENT =================

    const existingStudent = await Student.findOne({ email });

    console.log("EXISTING STUDENT:", existingStudent);

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student already exists. Please login.",
      });
    }

    // ================= HASH PASSWORD =================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= CREATE STUDENT =================

    const student = await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType || "student",
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // ================= PROFILE COMPLETENESS =================

    student.profileCompleteness =
      calculateProfileCompleteness(student);

    await student.save();

    console.log("STUDENT CREATED:", student._id);

    // ================= SUCCESS RESPONSE =================

    return handleAuthSuccess(
      student,
      res,
      "Student registered successfully"
    );

  } catch (err) {

    console.error("SIGNUP ERROR:", err);

    // Mongo duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: err.message,
    });

  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {

    console.log("LOGIN BODY:", req.body);

    let { email, password } = req.body;

    // ================= VALIDATION =================

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

    // ================= FIND STUDENT =================

    const student = await Student.findOne({ email });

    console.log("FOUND STUDENT:", student);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Student not registered",
      });
    }

    // ================= PASSWORD CHECK =================

    const isPasswordMatched = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    console.log("LOGIN SUCCESS:", student._id);

    // ================= SUCCESS =================

    return handleAuthSuccess(
      student,
      res,
      "Login successful"
    );

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });

  }
};

// ================= GET STUDENT DATA =================
export const getStudentData = async (req, res) => {
  try {

    const studentId = req.user.id;

    console.log("FETCHING STUDENT:", studentId);

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
