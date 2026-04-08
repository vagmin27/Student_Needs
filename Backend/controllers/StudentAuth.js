const bcrypt = require("bcrypt")
const Student = require("../models/StudentModel")
const College = require("../models/CollegeModel")
const jwt = require("jsonwebtoken")
const {handleAuthSuccess} = require('../utils/tokenGenerator');
require("dotenv").config()
const validator = require("validator")
const { calculateProfileCompleteness } = require("../utils/calculateProfileScore");

// Signup Controller for Registering USers

// Helper function for email and password validation
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



exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      collegeName,
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
        message: "All Fields are required",
      })
    }
    //validator
    if (!validateEmail(email, res)) {
        return;
    }
   
    // Check if user already exists
    const existingStudent = await Student.findOne({ email })
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists. Please sign in to continue.",
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

    
    const student = await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType || "Student",
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
      college: college._id,
    })

    // Calculate profile completeness
    student.profileCompleteness = calculateProfileCompleteness(student);
    await student.save();

    // Add student to college's student array
    college.Student.push(student._id);
    await college.save();

    // Populate college details before sending response
    await student.populate('college', 'name matchingName');

    // token generation, user object transformation, and response
    handleAuthSuccess(student, res, "student registered successfully");

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "student cannot be registered. Please try again.",
    })
  }
}

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body
      console.log("Login request body:", req.body);
    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    if (!validateEmail(email, res)) {
      return;
    }

    // Find user with provided email
    const student = await Student.findOne({ email });

    // If user not found with provided email
    if (!student) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `Student is not Registered with Us Please SignUp to Continue`,
      })
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, student.password)) {
        // token generation, user object transformation, and response
        return handleAuthSuccess(student, res, "Student logged in successfully");
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}