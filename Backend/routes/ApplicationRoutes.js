import express from "express";
const router = express.Router();

// Import controllers
import {
    viewApplications,
    viewStudentProfile,
    shortlistStudent,
    markAsReferred,
    rejectApplication,
    applyForReferral,
    getMyApplications,
    getApplicationDetails,
    downloadStudentResume,
} from "../controllers/ApplicationController.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Application Review routes (Alumni)
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// View Applications for an Opportunity (Alumni only - owner)
router.get("/applications/:opportunityId", viewApplications);

// View Student Profile (Alumni - same college)
router.get("/applications/student/:studentId", viewStudentProfile);

// Download Student Resume (Alumni - same college)
router.get("/applications/student/:studentId/resume", downloadStudentResume);

// Shortlist Student (Alumni only - owner)
router.post("/applications/:applicationId/shortlist", shortlistStudent);

// Mark as Referred (Alumni only - owner)
router.post("/applications/:applicationId/refer", markAsReferred);

// Reject Application (Alumni only - owner)
router.post("/applications/:applicationId/reject", rejectApplication);

// ********************************************************************************************************
//                                      Student Referral Application routes
// ********************************************************************************************************

// 5.1 Apply for Referral (Student only)
router.post("/apply", applyForReferral);

// 5.2 Application Status List - Get all my applications (Student only)
router.get("/my-applications", getMyApplications);

// 5.3 Application Details (Student only)
router.get("/my-applications/:applicationId", getApplicationDetails);

export default router;