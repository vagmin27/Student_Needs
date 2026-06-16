import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import fileUpload from "express-fileupload";
import path from "path";
import os from "os";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "express-rate-limit";
import compression from "compression";
import MongoStore from "connect-mongo";

import { validateEnv } from "./config/envValidator.js";
import { logger as winstonLogger } from "./utils/logger.js";
import { initSocket } from "./sockets/index.js";

import "./config/Tutorials/passport.js";
import "./config/Referrals/passport.js";


// =====================================================
//                    CONFIG IMPORTS
// =====================================================

// Tutorials DB
import { connectDB } from "./db/Tutorials/connection.js";

// Referral DB + Cloudinary
import { dbconnect } from "./config/Referrals/database.js";
import cloudinary from "./config/Referrals/cloudinary.js";

// Expenses DB
import connectDb from "./db/Expenses/db.js";

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
import tutorAttendanceRoutes from "./routes/Attendance/tutorAttendanceRoutes.js";

// =====================================================
//                  REFERRAL ROUTES
// =====================================================

import studentAuthRoutes from "./routes/Referrals/StudentAuthRoutes.js";
import profileRoutes from "./routes/Referrals/StudentProfileRoutes.js";
import resumeRoutes from "./routes/Referrals/StudentResumeRoutes.js";
import linkedInRoutes from "./routes/Referrals/StudentLinkedInRoutes.js";
import githubRoutes from "./routes/Referrals/StudentGithubRoutes.js";
import portfolioRoutes from "./routes/Referrals/StudentPortfolioRoutes.js";

import alumniAuthRoutes from "./routes/Referrals/AlumniAuthRoutes.js";
import alumniProfileRoutes from "./routes/Referrals/AlumniProfileRoutes.js";

import opportunityRoutes from "./routes/Referrals/OpportunityRoutes.js";
import applicationRoutes from "./routes/Referrals/ApplicationRoutes.js";
import externalJobRoutes from "./routes/Referrals/ExternalJobRoutes.js";
import interviewRoutes from "./routes/Referrals/InterviewRoutes.js";
import profileAnalysisRoutes from "./routes/Referrals/ProfileAnalysisRoutes.js";
import recommendationRoutes from "./routes/Referrals/RecommendationRoutes.js";
import chatRoutes from "./routes/Referrals/ChatRoutes.js";

// =====================================================
//                  EXPENSE ROUTES
// =====================================================

import userRouter from "./routes/Expenses/userRouter.js";
import expenseRouter from "./routes/Expenses/expenseRouter.js";
import budgetRouter from "./routes/Expenses/budgetRouter.js";
import goalRouter from "./routes/Expenses/goalRouter.js";
import analyticsRouter from "./routes/Expenses/analyticsRouter.js";
import notificationRouter from "./routes/Expenses/notificationRouter.js";
import expenseSettingsRouter from "./routes/Expenses/expenseSettingsRouter.js";
import billRouter from "./routes/Expenses/billRouter.js";
import reportRouter from "./routes/Expenses/reportRouter.js";
import recurringRuleRouter from "./routes/Expenses/recurringRuleRouter.js";


import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// =====================================================
//                  EXPENSE SCHEDULERS
// =====================================================

import {
  smartReminderScheduler,
  monthlyAnalysisScheduler,
  recurringTransactionScheduler,
  dailyBillReminderScheduler,
} from "./utils/Expenses/scheduler.js";
import { archiveCleanupScheduler } from "./utils/Referrals/scheduler.js";

// =====================================================
//                    ENV CONFIG
// =====================================================

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// =====================================================
//                    CORS CONFIG
// =====================================================

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL] 
  : ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080', 'https://student-needs.vercel.app'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.options(/.*/, cors());

// =====================================================
//                    MIDDLEWARE
// =====================================================

app.set("trust proxy", 1);
app.use(compression());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader("X-Request-Id", req.id);
  next();
});

morgan.token('id', function getId (req) { return req.id });

// Disable verbose request logging in production mode
if (process.env.NODE_ENV !== 'production') {
  app.use(
    morgan(
      ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
      {
        stream: winstonLogger.stream,
        skip: (req, res) => res.statusCode < 400,
      }
    )
  );
}

// =====================================================
//             REQUEST TIMING & OBSERVABILITY
// =====================================================

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    if (time > 500) {
      winstonLogger.warn(`SLOW REQUEST: ${req.method} ${req.originalUrl} - ${time}ms`);
    }
  });
  next();
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);

// =====================================================
//                 RATE LIMITERS
// =====================================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 attempts per windowMs
  message: {
    success: false,
    message: "Too many login/signup attempts from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});


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
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/TutorsApp",
      collectionName: "sessions",
      ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// =====================================================
//                    PASSPORT
// =====================================================

app.use(passport.initialize());

app.use(passport.session());

app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// =====================================================
//                    HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };

  res.status(200).json({
    success: true,
    message: "Unified Student Project API Running 🚀",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    health: {
      database: dbStatus[dbState] || "Unknown",
      memory: process.memoryUsage(),
    }
  });
});

// =====================================================
//                GLOBAL RATE LIMITING
// =====================================================
app.use("/api", generalLimiter);

// Specific Auth Limiters for sensitive endpoints
app.use("/api/login", authLimiter);
app.use("/api/tutor/login", authLimiter);

// =====================================================
//                TUTORIAL MODULE ROUTES
// =====================================================

app.use("/api", authTutorialRoutes);

app.use("/api/register", authLimiter, register);


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

app.use("/api/auth", authLimiter, authRoutes);


app.use("/api/students", studentRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/tutor-attendance", tutorAttendanceRoutes);

// =====================================================
//                REFERRAL MODULE ROUTES
// =====================================================

app.use("/api/v1/student/login", authLimiter);
app.use("/api/v1/student/signup", authLimiter);
app.use("/api/v1/alumni/login", authLimiter);
app.use("/api/v1/alumni/signup", authLimiter);

app.use("/api/v1/student", studentAuthRoutes);

app.use("/api/v1/student", profileRoutes);

app.use("/api/v1/student", resumeRoutes);

app.use("/api/v1/student", linkedInRoutes);

app.use("/api/v1/student", githubRoutes);

app.use("/api/v1/student", portfolioRoutes);

app.use("/api/v1/alumni", alumniAuthRoutes);

app.use("/api/v1/alumni", alumniProfileRoutes);

app.use("/api/v1", opportunityRoutes);

app.use("/api/v1", applicationRoutes);

app.use("/api/v1/student", externalJobRoutes);

app.use("/api/v1", interviewRoutes);

app.use("/api/v1", profileAnalysisRoutes);

app.use("/api/v1", recommendationRoutes);

app.use("/api/v1", chatRoutes);

// =====================================================
//                EXPENSE MODULE ROUTES
// =====================================================

app.use("/api/expenses/auth", authLimiter, userRouter);

app.use("/api/expenses/analytics", analyticsRouter);
app.use("/api/expenses/budgets", budgetRouter);
app.use("/api/expenses/expenses", expenseRouter);
app.use("/api/expenses/goals", goalRouter);
app.use("/api/expenses/notifications", notificationRouter);
app.use("/api/expenses/expense-settings", expenseSettingsRouter);
app.use("/api/expenses/reports", reportRouter);
app.use("/api/expenses/recurring-rules", recurringRuleRouter);
app.use("/api/expenses", billRouter);

// Legacy expense mounts removed for clean architecture.

// =====================================================
//                    404 HANDLER
// =====================================================

app.use((req, res) => {
  winstonLogger.warn(`[404] Missing Endpoint: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    diagnostics: {
      requestedUrl: req.originalUrl,
      method: req.method,
      availableGroups: [
        "/api/students",
        "/api/attendance",
        "/api/expenses",
        "/api/v1/student",
        "/api/v1/alumni",
        "/api/admin",
        "/api/analytics",
        "/api/notifications"
      ]
    }
  });
});

// =====================================================
//                GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  winstonLogger.error(`🔥 Error: ${err.message}`, { stack: err.stack });

  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : (err.message || "Internal Server Error"),
  });
});

// =====================================================
//                SERVER INITIALIZATION
// =====================================================

const initializeServer = async () => {
  try {
    // Validate Environment
    validateEnv();

    // Tutorials DB
    await connectDB();
    console.log("✅ Tutorials Database Connected");

    const { syncAttendanceIndexes } = await import(
      "./models/Attendance/Attendance.js"
    );
    const { syncSubjectIndexes } = await import(
      "./models/Attendance/Subject.js"
    );
    await syncSubjectIndexes();
    console.log("✅ Subject indexes synced (userId + subjectName)");
    await syncAttendanceIndexes();
    console.log("✅ Attendance indexes synced (userId + subjectId + date)");

    // Referral DB
    await dbconnect();
    console.log("✅ Referral Database Connected");

    // Dynamic LinkedIn Migration
    try {
      const Student = mongoose.model("ReferralStudent");
      const studentsToMigrate = await Student.find({
        "linkedIn.linkedInUrl": { $exists: true, $ne: "" },
        $or: [
          { linkedinUrl: { $exists: false } },
          { linkedinUrl: "" }
        ]
      });

      if (studentsToMigrate.length > 0) {
        console.log(`🧹 Migrating ${studentsToMigrate.length} student LinkedIn profiles...`);
        for (const student of studentsToMigrate) {
          student.linkedinUrl = student.linkedIn.linkedInUrl;
          student.linkedIn = undefined;
          await student.save();
        }
        console.log("✅ LinkedIn URL migration complete!");
      }
    } catch (migErr) {
      console.warn("⚠️ Migration warning:", migErr.message);
    }

    // Expenses DB
    await connectDb();

    // Expense Schedulers
    smartReminderScheduler();
    monthlyAnalysisScheduler();
    recurringTransactionScheduler();
    dailyBillReminderScheduler();

    // Referral Archival Scheduler
    archiveCleanupScheduler();

    // Cloudinary
    cloudinary.cloudinaryConnect();
    console.log("✅ Cloudinary Connected");

    // Start Server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Unified Server running on port ${PORT}`);
    });

    // Initialize WebSockets
    initSocket(server);

    const gracefulShutdown = () => {
      console.log('SIGTERM/SIGINT signal received. Shutting down gracefully...');
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await mongoose.disconnect();
          console.log('MongoDB connection closed.');
        } catch(e) {
          console.error("Error closing MongoDB", e);
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error("❌ Server Initialization Failed");

    console.error(error.message);

    process.exit(1);
  }
};

initializeServer();

// =====================================================
//             GLOBAL PROCESS EXCEPTION HANDLERS
// =====================================================
process.on("unhandledRejection", (reason, promise) => {
  winstonLogger.error("🔥 Unhandled Rejection at:", { promise, reason: reason?.stack || reason });
});

process.on("uncaughtException", (error) => {
  winstonLogger.error("🔥 Uncaught Exception:", { error: error?.stack || error });
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});
