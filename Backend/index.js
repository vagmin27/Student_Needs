import express from "express";
import { dbconnect } from "./config/database.js";
import cloudinary from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import studentAuthRoutes from "./routes/StudentAuthRoutes.js";
import profileRoutes from "./routes/StudentProfileRoutes.js";
import resumeRoutes from "./routes/StudentResumeRoutes.js";
import linkedInRoutes from "./routes/StudentLinkedInRoutes.js";
import githubRoutes from "./routes/StudentGithubRoutes.js";
import alumniAuthRoutes from "./routes/AlumniAuthRoutes.js";
import alumniProfileRoutes from "./routes/AlumniProfileRoutes.js";
import opportunityRoutes from "./routes/OpportunityRoutes.js";
import applicationRoutes from "./routes/ApplicationRoutes.js";
import externalJobRoutes from "./routes/ExternalJobRoutes.js";
import interviewRoutes from "./routes/InterviewRoutes.js";
import profileAnalysisRoutes from "./routes/ProfileAnalysisRoutes.js";

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:5173",
  "http://172.26.38.74:8080",
  "https://next-ref-alumni-connect.vercel.app",
  "https://next-reff-alumni-connect.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Health check endpoint
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Alumni Connect API is running successfully!",
    timestamp: new Date().toISOString()
  });
});

// Mount routes
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

const initializeConnection = async () => {
  try {
    await dbconnect();
    console.log("✅ Connected to MongoDB");
    
    cloudinary.cloudinaryConnect();
    console.log("✅ Connected to Cloudinary");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize application");
    console.error("Error:", err.message);
    process.exit(1);
  }
};

initializeConnection();