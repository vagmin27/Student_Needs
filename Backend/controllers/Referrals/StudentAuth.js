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


    let {
      firstName,
      lastName,
      email,
      password,
      collegeName,
      accountType,
    } = req.body;

    // ================= REQUIRED FIELD VALIDATION =================

    if (!firstName || !lastName || !email || !password || !collegeName) {
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

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student already exists. Please login.",
      });
    }

    // ================= FIND OR CREATE COLLEGE =================
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

    // ================= HASH PASSWORD =================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= CREATE STUDENT =================

    const student = await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType || "student",
      college: college._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // ================= LINK COLLEGE =================
    college.Student.push(student._id);
    await college.save();

    // ================= PROFILE COMPLETENESS =================

    student.profileCompleteness =
      calculateProfileCompleteness(student);

    await student.save();
    
    // Populate college for the response
    await student.populate("college", "name matchingName");

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
