const bcrypt = require("bcrypt")
const Alumni = require("../models/AlumniModel")
const College = require("../models/CollegeModel")
const jwt = require("jsonwebtoken")
const {handleAuthSuccess} = require('../utils/tokenGenerator');
require("dotenv").config()
const validator = require("validator")

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
exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      collegeName,
      company,
      jobTitle,
    } = req.body

    // Check if All Details are there or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !collegeName
    ) {
      return res.status(403).send({
        success: false,
        message: "All required fields (firstName, lastName, email, password, collegeName) are required",
      })
    }

    // Validator
    if (!validateEmail(email, res)) {
        return;
    }
   
    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email })
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: "Alumni already exists. Please sign in to continue.",
      })
    }

    // Remove spaces from college name to create matchingName
    const matchingName = collegeName.replace(/\s+/g, '').toLowerCase();

    // Check if college exists with matching name
    let college = await College.findOne({ matchingName });

    // If college doesn't exist, create it
    if (!college) {
      college = await College.create({
        name: collegeName,
        matchingName: matchingName,
        Student: [],
        Alumni: [],
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create alumni
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
    })

    // Add alumni to college's alumni array
    college.Alumni.push(alumni._id);
    await college.save();

    // Populate college details before sending response
    await alumni.populate('college', 'name matchingName');

    // token generation, user object transformation, and response
    handleAuthSuccess(alumni, res, "Alumni registered successfully");

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Alumni cannot be registered. Please try again.",
    })
  }
}

// Alumni Login Controller
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body
    console.log("Alumni login request body:", req.body);

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please fill up all the required fields`,
      })
    }

    // Validate email
    if (!validateEmail(email, res)) {
      return;
    }

    // Find alumni with provided email
    const alumni = await Alumni.findOne({ email }).populate('college', 'name matchingName');

    // If alumni not found with provided email
    if (!alumni) {
      return res.status(401).json({
        success: false,
        message: `Alumni is not registered with us. Please sign up to continue`,
      })
    }

    // Compare password
    if (await bcrypt.compare(password, alumni.password)) {
        // token generation, user object transformation, and response
        return handleAuthSuccess(alumni, res, "Alumni logged in successfully");
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: `Login failure. Please try again`,
    })
  }
}

