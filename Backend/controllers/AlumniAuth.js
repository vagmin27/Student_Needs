import bcrypt from "bcrypt";
import Alumni from "../models/AlumniModel.js";
import College from "../models/CollegeModel.js";
import { handleAuthSuccess } from "../utils/tokenGenerator.js";
import dotenv from "dotenv";
import validator from "validator";

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
    const {
      firstName,
      lastName,
      email,
      password,
      collegeName,
      company,
      jobTitle,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !collegeName) {
      return res.status(403).json({
        success: false,
        message: "All required fields are required",
      });
    }

    if (!validateEmail(email, res)) return;

    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: "Alumni already exists. Please login.",
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

    const alumni = await Alumni.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: "Alumni",
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
      college: college._id,
      company: company || "",
      jobTitle: jobTitle || "",
    });

    college.Alumni.push(alumni._id);
    await college.save();

    await alumni.populate("college", "name matchingName");

    return handleAuthSuccess(alumni, res, "Alumni registered successfully");

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Alumni cannot be registered. Please try again.",
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

    const alumni = await Alumni.findOne({ email }).populate(
      "college",
      "name matchingName"
    );

    if (!alumni) {
      return res.status(401).json({
        success: false,
        message: "Alumni not registered",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, alumni.password);

    if (isPasswordMatch) {
      return handleAuthSuccess(alumni, res, "Alumni logged in successfully");
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

// ================= 🔥 ADD THIS (FIX) =================
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