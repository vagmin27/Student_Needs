import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import passport from "passport";
import fileUpload from "express-fileupload";
import path from "path";

import "./config/Tutorials/passport.js";

// =====================================================
//                    CONFIG IMPORTS
// =====================================================

// Tutorials DB
import { connectDB } from "./db/Tutorials/connection.js";

// Referral DB + Cloudinary
import { dbconnect } from "./config/Referrals/database.js";
import cloudinary from "./config/Referrals/cloudinary.js";

// =====================================================
//                    TUTORIAL ROUTES
// =====================================================

import tutor from "./routes/Tutorials/tutors.js";
import booking from "./routes/Tutorials/booking.js";
import classHistory from "./routes/Tutorials/classHistory.js";
import editProfile from "./routes/Tutorials/editProfile.js";
import profile from "./routes/Tutorials/profile.js";
import accountSetting from "./routes/Tutorials/accountSetting.js";
import register from "./routes/Tutorials/register.js";
import authTutorialRoutes from "./routes/Tutorials/auth.js";
import tutorRoutes from "./routes/Tutorials/tutorRoutes.js";
import uploadRoutes from "./routes/Tutorials/uploadRoutes.js";

// =====================================================
//                  ATTENDANCE ROUTES
// =====================================================

import authRoutes from "./routes/Attendance/authRoutes.js";
import studentRoutes from "./routes/Attendance/studentRoutes.js";
import subjectRoutes from "./routes/Attendance/subjectRoutes.js";
import attendanceRoutes from "./routes/Attendance/attendanceRoutes.js";

// =====================================================
//                  REFERRAL ROUTES
// =====================================================

import studentAuthRoutes from "./routes/Referrals/StudentAuthRoutes.js";
import profileRoutes from "./routes/Referrals/StudentProfileRoutes.js";
import resumeRoutes from "./routes/Referrals/StudentResumeRoutes.js";
import linkedInRoutes from "./routes/Referrals/StudentLinkedInRoutes.js";
import githubRoutes from "./routes/Referrals/StudentGithubRoutes.js";

import alumniAuthRoutes from "./routes/Referrals/AlumniAuthRoutes.js";
import alumniProfileRoutes from "./routes/Referrals/AlumniProfileRoutes.js";

import opportunityRoutes from "./routes/Referrals/OpportunityRoutes.js";
import applicationRoutes from "./routes/Referrals/ApplicationRoutes.js";
import externalJobRoutes from "./routes/Referrals/ExternalJobRoutes.js";
import interviewRoutes from "./routes/Referrals/InterviewRoutes.js";
import profileAnalysisRoutes from "./routes/Referrals/ProfileAnalysisRoutes.js";

// =====================================================
//                    MIDDLEWARES
// =====================================================

import {
  isAuthenticated,
  isStudent,
  isTutor,
} from "./middlewares/Tutorials/auth.js";

// =====================================================
//                    ENV CONFIG
// =====================================================

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// =====================================================
//                    MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(logger("dev"));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// =====================================================
//                    STATIC FILES
// =====================================================

app.use("/uploads", express.static("uploads"));

// =====================================================
//                    SESSION CONFIG
// =====================================================

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// =====================================================
//                    PASSPORT
// =====================================================

app.use(passport.initialize());
app.use(passport.session());

// =====================================================
//                    CORS CONFIG
// =====================================================

const allowedOrigins = [
  // Tutorials
  "http://localhost:5173",

  // Attendance
  "http://localhost:3000",
  "https://attendancemonitoringsyst-b1ae8.web.app",
  "https://mern-attendance-app.onrender.com",

  // Referral
  "http://localhost:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:5173",
  "http://172.26.38.74:8080",
  "https://next-ref-alumni-connect.vercel.app",
  "https://next-reff-alumni-connect.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  })
);

// =====================================================
//                    HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Unified Student Project API Running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
//                TUTORIAL MODULE ROUTES
// =====================================================

app.use("/api", authTutorialRoutes);

app.use("/api/register", register);

app.use("/api/tutors", tutor);

app.use("/api/profile", profile);

app.use("/api/edit-profile", editProfile);

app.use("/api/account", accountSetting);

app.use("/api/booking", booking);

app.use("/api/history", classHistory);

app.use("/api/tutor", tutorRoutes);

app.use("/api/upload", uploadRoutes);

// =====================================================
//                ATTENDANCE MODULE ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/attendance", attendanceRoutes);

// =====================================================
//                REFERRAL MODULE ROUTES
// =====================================================

app.use("/api/v1/student", studentAuthRoutes);

app.use("/api/v1/student", profileRoutes);

app.use("/api/v1/student", resumeRoutes);

app.use("/api/v1/student", linkedInRoutes);

app.use("/api/v1/student", githubRoutes);

app.use("/api/v1/alumni", alumniAuthRoutes);

app.use("/api/v1/alumni", alumniProfileRoutes);

app.use("/api/v1", opportunityRoutes);

app.use("/api/v1", applicationRoutes);

app.use("/api/v1/student", externalJobRoutes);

app.use("/api/v1", interviewRoutes);

app.use("/api/v1", profileAnalysisRoutes);

// =====================================================
//                    404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================================
//                GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =====================================================
//                SERVER INITIALIZATION
// =====================================================

const initializeServer = async () => {
  try {
    // Tutorials DB
    await connectDB();
    console.log("✅ Tutorials Database Connected");

    // Referral DB
    await dbconnect();
    console.log("✅ Referral Database Connected");

    // Cloudinary
    cloudinary.cloudinaryConnect();
    console.log("✅ Cloudinary Connected");

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Unified Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server Initialization Failed");
    console.error(error.message);

    process.exit(1);
  }
};

initializeServer();