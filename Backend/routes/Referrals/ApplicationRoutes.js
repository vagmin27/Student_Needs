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
    getVerifiedCandidates,
    getGroupedApplications,
    approveApplication,
} from "../../controllers/Referrals/ApplicationController.js";

// Import middleware
import { auth } from "../../middlewares/Referrals/auth.js";

// ********************************************************************************************************
//                                      Application Review routes (Alumni)
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// View Verified Candidates (Alumni)
router.get("/verified-candidates", getVerifiedCandidates);

// Get all applications grouped by role (Alumni)
router.get("/applications", getGroupedApplications);

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

// Approve application (Alumni only - owner)
router.post("/applications/:id/approve", approveApplication);

// Reject Application (Alumni only - owner)
router.post("/applications/:id/reject", rejectApplication);
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