import bcrypt from "bcrypt";
import Student from "../models/StudentModel.js";
import College from "../models/CollegeModel.js";
import jwt from "jsonwebtoken";
import { handleAuthSuccess } from "../utils/tokenGenerator.js";
import dotenv from "dotenv";
import validator from "validator";
import { calculateProfileCompleteness } from "../utils/calculateProfileScore.js";

dotenv.config();

// ================= VALIDATION =================
function validateEmail(email, res) {
  if (!validator.isEmail(email)) {
    res.status(403).json({
      success: false,
      message: "Invalid Email",
    });
    return false;
  }
  return true;
}

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType, collegeName } = req.body;

    if (!firstName || !lastName || !email || !password || !collegeName) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    if (!validateEmail(email, res)) return;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists. Please login.",
      });
    }

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

    const student = await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType || "Student",
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
      college: college._id,
    });

    // Profile score
    student.profileCompleteness = calculateProfileCompleteness(student);
    await student.save();

    // Add to college
    college.Student.push(student._id);
    await college.save();

    await student.populate("college", "name matchingName");

    return handleAuthSuccess(student, res, "Student registered successfully");

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Student cannot be registered",
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!validateEmail(email, res)) return;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Student not registered",
      });
    }

    if (await bcrypt.compare(password, student.password)) {
      return handleAuthSuccess(student, res, "Login successful");
    } else {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ================= GET STUDENT DATA (🔥 FIX ADDED) =================
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
    console.error("Get Student Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student data",
    });
  }
};