import bcrypt from "bcrypt";
import Alumni from "../models/AlumniModel.js";
import College from "../models/CollegeModel.js";
import jwt from "jsonwebtoken";
import { handleAuthSuccess } from "../utils/tokenGenerator.js";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

// Helper function for email validation
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

// Alumni Signup Controller
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
      return res.status(403).send({
        success: false,
        message: "All required fields are required",
      });
    }

    if (!validateEmail(email, res)) return;

    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: "Alumni already exists. Please sign in to continue.",
      });
    }

    const matchingName = collegeName.replace(/\s+/g, "").toLowerCase();

    let college = await College.findOne({ matchingName });

    if (!college) {
      college = await College.create({
        name: collegeName,
        matchingName: matchingName,
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

    handleAuthSuccess(alumni, res, "Alumni registered successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Alumni cannot be registered. Please try again.",
    });
  }
};

// Alumni Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please fill up all the required fields`,
      });
    }

    if (!validateEmail(email, res)) return;

    const alumni = await Alumni.findOne({ email }).populate("college", "name matchingName");

    if (!alumni) {
      return res.status(401).json({
        success: false,
        message: `Alumni is not registered with us. Please sign up to continue`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, alumni.password);

    if (isPasswordMatch) {
      return handleAuthSuccess(alumni, res, "Alumni logged in successfully");
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login failure. Please try again`,
    });
  }
};