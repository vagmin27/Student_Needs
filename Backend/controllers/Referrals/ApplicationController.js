import Application from "../../models/Referrals/ApplicationModel.js";
import Opportunity from "../../models/Referrals/OpportunityModel.js";
import Student from "../../models/Referrals/StudentModel.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import Chat from "../../models/Referrals/ChatModel.js";
import { notificationService } from "../../services/NotificationService.js";
import { calculateProfileCompleteness } from "../../utils/Referrals/calculateProfileScore.js";

const calculateAlumniProfileCompleteness = (alumni) => {
  let score = 0;
  if (alumni.firstName) score += 5;
  if (alumni.lastName) score += 5;
  if (alumni.email) score += 5;
  if (alumni.image) score += 5;

  if (alumni.company) score += 8;
  if (alumni.jobTitle) score += 8;
  if (alumni.yearsOfExperience !== undefined && alumni.yearsOfExperience !== null) score += 7;
  if (alumni.skills && alumni.skills.length > 0) score += 7;

  if (alumni.referralPreferences) score += 10;
  if (alumni.hiringInterests) score += 10;

  if (alumni.bio) score += 6;
  if (alumni.careerJourney) score += 6;
  if (alumni.linkedinUrl) score += 6;
  if (alumni.githubUrl) score += 6;
  if (alumni.portfolioUrl) score += 6;

  return Math.min(score, 100);
};

// =====================================================
// ALUMNI SIDE - Management Endpoints
// =====================================================

export const getVerifiedCandidates = async (req, res) => {
    try {
        const alumniId = req.user.id;

        const applications = await Application.find({
            alumni: alumniId,
            status: { $in: ["approved", "Referred", "Shortlisted"] }
        })
        .populate('student', 'firstName lastName email college branch graduationYear skills profileCompleteness image cgpa resume')
        .populate('opportunity', 'jobTitle experienceLevel')
        .sort({ updatedAt: -1 });

        // Retrieve or create Chat rooms for these candidates
        const applicationsWithChat = await Promise.all(applications.map(async (app) => {
            const chat = await Chat.findOneAndUpdate(
                { student: app.student._id, alumni: alumniId },
                { $setOnInsert: { student: app.student._id, alumni: alumniId } },
                { upsert: true, new: true, returnDocument: 'after' }
            );
            const appObj = app.toObject();
            appObj.chatId = chat ? chat._id : null;
            return appObj;
        }));

        // Group by jobTitle dynamically
        const grouped = {};
        for (const app of applicationsWithChat) {
            const roleName = app.opportunity?.jobTitle || "Other Opportunity";
            if (!grouped[roleName]) {
                grouped[roleName] = [];
            }
            grouped[roleName].push(app);
        }

        return res.status(200).json({
            success: true,
            total: applicationsWithChat.length,
            data: grouped,
            message: "Verified candidates fetched successfully",
        });
    } catch (error) {
        console.error("Get verified candidates error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch verified candidates. Please try again.",
        });
    }
};

// View Applications for an Opportunity
export const viewApplications = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { opportunityId } = req.params;

        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        if (opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view applications for this opportunity",
            });
        }

        const applications = await Application.find({
            opportunity: opportunityId,
        })
        .populate('student', 'firstName lastName email college branch graduationYear skills profileCompleteness image')
        .populate('opportunity', 'jobTitle experienceLevel')
        .sort({ createdAt: -1 });

        // Retrieve or create Chat rooms for these applicants
        const applicationsWithChat = await Promise.all(applications.map(async (app) => {
            const chat = await Chat.findOneAndUpdate(
                { student: app.student._id, alumni: alumniId },
                { $setOnInsert: { student: app.student._id, alumni: alumniId } },
                { upsert: true, new: true, returnDocument: 'after' }
            );
            const appObj = app.toObject();
            appObj.chatId = chat ? chat._id : null;
            return appObj;
        }));

        const groupedApplications = {
            applied: applicationsWithChat.filter(app => app.status === "Applied"),
            shortlisted: applicationsWithChat.filter(app => app.status === "Shortlisted"),
            referred: applicationsWithChat.filter(app => app.status === "Referred"),
            rejected: applicationsWithChat.filter(app => app.status === "Rejected"),
        };

        return res.status(200).json({
            success: true,
            total: applicationsWithChat.length,
            data: {
                all: applicationsWithChat,
                grouped: groupedApplications,
                counts: {
                    applied: groupedApplications.applied.length,
                    shortlisted: groupedApplications.shortlisted.length,
                    referred: groupedApplications.referred.length,
                    rejected: groupedApplications.rejected.length,
                }
            },
            message: "Applications fetched successfully",
        });

    } catch (error) {
        console.error("View applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications. Please try again.",
        });
    }
};

// View Student Profile (Read-Only)
export const viewStudentProfile = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { studentId } = req.params;

        const student = await Student.findById(studentId)
            .select("-password -resume.data -linkedIn.data")
            .populate('college', 'name matchingName');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const alumni = await Alumni.findById(alumniId).populate('college', 'name matchingName');
        if (!alumni || !alumni.college?._id) {
            return res.status(400).json({
                success: false,
                message: "Alumni college information not found",
            });
        }

        if (student.college.matchingName !== alumni.college.matchingName) {
            return res.status(403).json({
                success: false,
                message: "You can only view profiles of students from your college",
            });
        }

        return res.status(200).json({
            success: true,
            data: student,
            message: "Student profile fetched successfully",
        });

    } catch (error) {
        console.error("View student profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student profile. Please try again.",
        });
    }
};

// Shortlist Student
export const shortlistStudent = async (req, res) => {
    try {
        const alumniId = req.user.id || req.user._id;
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId)
            .populate('opportunity')
            .populate('student', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const opportunity = await Opportunity.findById(application.opportunity?._id || application.opportunity);
        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Associated opportunity not found",
            });
        }

        if (opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to shortlist this application",
            });
        }

        if (application.status === "Shortlisted") {
            return res.status(400).json({
                success: false,
                message: "Application is already shortlisted",
            });
        }

        if (application.status === "Referred") {
            return res.status(400).json({
                success: false,
                message: "Application is already referred. Cannot change status.",
            });
        }

        application.status = "Shortlisted";
        application.shortlistedAt = new Date();

        if (!application.statusHistory) {
            application.statusHistory = [];
        }
        application.statusHistory.push({
            status: "Shortlisted",
            timestamp: new Date(),
            note: "Application shortlisted by alumni"
        });

        await application.save();

        try {
            await notificationService.createAndEmitNotification({
                recipientId: application.student._id || application.student,
                senderId: alumniId,
                type: 'REFERRAL',
                title: 'Application Shortlisted',
                message: `Your application for ${opportunity.jobTitle} has been shortlisted!`,
                link: '/student/my-applications'
            });
        } catch (notifError) {
            console.error("Failed to emit notification in shortlistStudent:", notifError);
        }

        // Trigger Alumni Dashboard Refresh to update grouped application counts
        notificationService.emitToUser(alumniId, 'dashboard_refresh', { type: 'referral_update' });

        return res.status(200).json({
            success: true,
            data: application,
            message: "Student shortlisted successfully",
        });

    } catch (error) {
        console.error("Shortlist student error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to shortlist student. Please try again.",
        });
    }
};

// Mark as Referred
export const markAsReferred = async (req, res) => {
    try {
        const alumniId = req.user.id || req.user._id;
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId)
            .populate('opportunity')
            .populate('student', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const opportunity = await Opportunity.findById(application.opportunity?._id || application.opportunity);
        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Associated opportunity not found",
            });
        }

        if (opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this application",
            });
        }

        if (application.status === "Referred") {
            return res.status(400).json({
                success: false,
                message: "Application is already marked as referred",
            });
        }

        if ((opportunity.referralsGiven || 0) >= opportunity.numberOfReferrals) {
            return res.status(400).json({
                success: false,
                message: "No more referral slots available for this opportunity",
            });
        }

        application.status = "Referred";
        application.referredAt = new Date();
        
        if (!application.shortlistedAt) {
            application.shortlistedAt = new Date();
        }

        if (!application.statusHistory) {
            application.statusHistory = [];
        }
        application.statusHistory.push({
            status: "Referred",
            timestamp: new Date(),
            note: "Application marked as referred by alumni"
        });

        await application.save();

        opportunity.referralsGiven = (opportunity.referralsGiven || 0) + 1;
        
        if (opportunity.referralsGiven >= opportunity.numberOfReferrals) {
            opportunity.status = "Closed";
        }
        await opportunity.save();

        try {
            await notificationService.createAndEmitNotification({
                recipientId: application.student._id || application.student,
                senderId: alumniId,
                type: 'REFERRAL',
                title: 'Referral Granted!',
                message: `You have successfully been referred for ${opportunity.jobTitle}.`,
                link: '/student/my-applications'
            });
        } catch (notifError) {
            console.error("Failed to emit notification in markAsReferred:", notifError);
        }

        notificationService.emitToUser(alumniId, 'dashboard_refresh', { type: 'referral_update' });

        return res.status(200).json({
            success: true,
            data: application,
            message: "Application marked as referred successfully",
        });

    } catch (error) {
        console.error("Mark as referred error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark application as referred. Please try again.",
        });
    }
};

// Reject Application
export const rejectApplication = async (req, res) => {
    console.log("=== REJECT APPLICATION START ===");
    console.log("Request params id/applicationId:", req.params.id, req.params.applicationId);
    console.log("Request user:", req.user);
    try {
        const alumniId = req.user.id || req.user._id;
        const { id, applicationId } = req.params;
        const appId = id || applicationId;

        const application = await Application.findById(appId)
            .populate('opportunity');

        console.log("Fetched application:", application);

        if (!application) {
            console.log("Application not found for ID:", appId);
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const opportunity = await Opportunity.findById(application.opportunity?._id || application.opportunity);
        console.log("Fetched opportunity:", opportunity);

        if (!opportunity) {
            console.log("Opportunity not found for Application:", application);
            return res.status(404).json({
                success: false,
                message: "Associated opportunity not found",
            });
        }

        if (opportunity.postedBy.toString() !== alumniId) {
            console.log("Unauthorized alumni rejection attempt:", { postedBy: opportunity.postedBy, alumniId });
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this application",
            });
        }

        application.status = "rejected";
        application.rejectedAt = new Date();
        application.rejectedBy = alumniId;

        if (!application.statusHistory) {
            application.statusHistory = [];
        }
        application.statusHistory.push({
            status: "rejected",
            timestamp: new Date(),
            note: "Application rejected by alumni"
        });

        await application.save();
        console.log("Application status rejected saved successfully.");

        try {
            await notificationService.createAndEmitNotification({
                recipientId: application.student._id || application.student,
                senderId: alumniId,
                type: 'REFERRAL',
                title: 'Application Update',
                message: `Your application for ${opportunity.jobTitle} was not selected.`,
                link: '/student/my-applications'
            });
        } catch (notifError) {
            console.error("Failed to emit notification in rejectApplication:", notifError);
        }

        notificationService.emitToUser(alumniId, 'dashboard_refresh', { type: 'referral_update' });

        return res.status(200).json({
            success: true,
            message: "Application rejected successfully",
        });

    } catch (error) {
        console.error("Reject application error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject application. Please try again.",
            error: error.message,
            stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
        });
    }
};

// =====================================================
// STUDENT SIDE - Referral Application Endpoints
// =====================================================

export const applyForReferral = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { opportunityId } = req.body;

        if (!opportunityId) {
            return res.status(400).json({
                success: false,
                message: "Opportunity ID is required",
            });
        }

        const student = await Student.findById(studentId)
            .populate('college', 'name matchingName');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        if (!student.resume?.data) {
            return res.status(400).json({
                success: false,
                message: "Please upload your resume before applying for referrals",
            });
        }

        const opportunity = await Opportunity.findById(opportunityId)
            .populate({
                path: 'postedBy',
                select: 'firstName lastName email company currentRole college',
                populate: {
                    path: 'college',
                    select: 'name matchingName'
                }
            })
            .populate('college', 'name matchingName');

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        if (opportunity.status !== "Open") {
            return res.status(400).json({
                success: false,
                message: "This opportunity is no longer accepting applications",
            });
        }

        if (opportunity.referralsGiven >= opportunity.numberOfReferrals) {
            return res.status(400).json({
                success: false,
                message: "All referral slots for this opportunity have been filled",
            });
        }

        if (!student.college || !opportunity.college) {
            return res.status(400).json({
                success: false,
                message: "College information is missing. Please update your profile.",
            });
        }

        if (student.college.matchingName !== opportunity.college.matchingName) {
            return res.status(403).json({
                success: false,
                message: "You can only apply for referrals from alumni of your college",
            });
        }

        const existingApplication = await Application.findOne({
            opportunity: opportunityId,
            student: studentId,
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this opportunity",
            });
        }

        const profileSnapshot = {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            branch: student.branch,
            graduationYear: student.graduationYear,
            skills: student.skills || [],
            profileCompleteness: student.profileCompleteness,
            cgpa: student.cgpa || null,
        };

        const resumeSnapshot = {
            fileName: student.resume.fileName,
            fileSize: student.resume.fileSize,
            contentType: student.resume.contentType,
            uploadedAt: student.resume.uploadedAt,
        };

        const application = await Application.create({
            opportunity: opportunityId,
            student: studentId,
            alumni: opportunity.postedBy._id,
            status: "pending",
            studentDetails: {
                profileScore: req.body.profileScore || null,
                interviewScore: req.body.interviewScore || null,
            },
            profileSnapshot,
            resumeSnapshot,
            appliedAt: new Date(),
            statusHistory: [{
                status: "pending",
                timestamp: new Date(),
                note: "Application submitted",
            }],
        });

        // Automatically create or find chat room between student and opportunity poster (alumni)
        let chat = null;
        try {
            chat = await Chat.findOneAndUpdate(
                { student: studentId, alumni: opportunity.postedBy._id },
                { $setOnInsert: { student: studentId, alumni: opportunity.postedBy._id } },
                { upsert: true, new: true, returnDocument: 'after' }
            );
            console.log(`💬 Chat room verified/created between Student ${studentId} and Alumni ${opportunity.postedBy._id}`);
        } catch (chatRoomErr) {
            console.error("⚠️ Failed to automatically create chat room on application:", chatRoomErr.message);
        }

        const populatedApplication = await Application.findById(application._id)
            .populate('opportunity', 'jobTitle roleDescription experienceLevel requiredSkills')
            .populate('alumni', 'firstName lastName company currentRole');

        // Increment the applications count dynamically
        await Opportunity.findByIdAndUpdate(opportunityId, {
            $inc: { applicationsCount: 1, engagementScore: 1 }
        });

        await notificationService.createAndEmitNotification({
            recipientId: opportunity.postedBy._id,
            senderId: studentId,
            title: 'New Referral Application',
            message: `New applicant can now contact you regarding your opportunity.`,
            type: 'REFERRAL',
            link: chat ? `/alumni/chat?chatId=${chat._id}` : `/alumni/chat`
        });

        return res.status(201).json({
            success: true,
            data: {
                application: populatedApplication,
                chat: chat ? {
                    _id: chat._id,
                    student: chat.student,
                    alumni: chat.alumni
                } : null,
                message: "Your application has been submitted successfully",
            },
            message: "Applied for referral successfully",
        });

    } catch (error) {
        console.error("Apply for referral error:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this opportunity",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to apply for referral. Please try again.",
        });
    }
};

// Application Status List
export const getMyApplications = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        const filter = { student: studentId };
        if (status && ["Applied", "Shortlisted", "Referred", "Rejected", "pending", "approved", "rejected"].includes(status)) {
            filter.status = status;
        }

        const totalCount = await Application.countDocuments(filter);

        const applications = await Application.find(filter)
            .populate('opportunity', 'jobTitle roleDescription experienceLevel requiredSkills status')
            .populate('alumni', 'firstName lastName email company currentRole image')
            .sort({ appliedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Retrieve or create Chat rooms for these applications
        const applicationsWithChat = await Promise.all(applications.map(async (app) => {
            const chat = await Chat.findOneAndUpdate(
                { student: studentId, alumni: app.alumni._id },
                { $setOnInsert: { student: studentId, alumni: app.alumni._id } },
                { upsert: true, new: true, returnDocument: 'after' }
            );
            const appObj = app.toObject();
            appObj.chatId = chat ? chat._id : null;
            return appObj;
        }));

        const allApplications = await Application.find({ student: studentId });
        const statusSummary = {
            applied: allApplications.filter(app => ["Applied", "pending"].includes(app.status)).length,
            shortlisted: allApplications.filter(app => ["Shortlisted", "approved"].includes(app.status)).length,
            referred: allApplications.filter(app => ["Referred"].includes(app.status)).length,
            rejected: allApplications.filter(app => ["Rejected", "rejected"].includes(app.status)).length,
        };

        return res.status(200).json({
            success: true,
            data: {
                applications: applicationsWithChat,
                statusSummary,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limit),
                    totalApplications: totalCount,
                    hasNextPage: page * limit < totalCount,
                    hasPrevPage: page > 1,
                },
            },
            message: "Applications fetched successfully",
        });

    } catch (error) {
        console.error("Get my applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications. Please try again.",
        });
    }
};

// Application Details
export const getApplicationDetails = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId)
            .populate('opportunity', 'jobTitle roleDescription experienceLevel requiredSkills status numberOfReferrals createdAt')
            .populate('alumni', 'firstName lastName email company currentRole image linkedIn')
            .populate('student', 'firstName lastName');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        if (application.student._id.toString() !== studentId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this application",
            });
        }

        const chat = await Chat.findOneAndUpdate(
            { student: application.student._id, alumni: application.alumni._id },
            { $setOnInsert: { student: application.student._id, alumni: application.alumni._id } },
            { upsert: true, new: true, returnDocument: 'after' }
        );

        const applicationDetails = {
            _id: application._id,
            status: application.status,
            appliedAt: application.appliedAt,
            shortlistedAt: application.shortlistedAt,
            referredAt: application.referredAt,
            rejectedAt: application.rejectedAt,
            chatId: chat ? chat._id : null,
            opportunity: {
                _id: application.opportunity._id,
                jobTitle: application.opportunity.jobTitle,
                roleDescription: application.opportunity.roleDescription,
                experienceLevel: application.opportunity.experienceLevel,
                requiredSkills: application.opportunity.requiredSkills,
                status: application.opportunity.status,
                postedAt: application.opportunity.createdAt,
            },
            alumni: {
                _id: application.alumni._id,
                name: `${application.alumni.firstName} ${application.alumni.lastName}`,
                company: application.alumni.company,
                currentRole: application.alumni.currentRole,
                image: application.alumni.image,
                linkedIn: application.alumni.linkedIn,
            },
            resumeSnapshot: application.resumeSnapshot,
            profileSnapshot: application.profileSnapshot,
            statusHistory: application.statusHistory || [],
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
        };

        return res.status(200).json({
            success: true,
            data: applicationDetails,
            message: "Application details fetched successfully",
        });

    } catch (error) {
        console.error("Get application details error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch application details. Please try again.",
        });
    }
};

// Download Student Resume
export const downloadStudentResume = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { studentId } = req.params;

        const student = await Student.findById(studentId)
            .select('resume college')
            .populate('college', 'matchingName');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const alumni = await Alumni.findById(alumniId).populate('college', 'matchingName');
        
        if (!alumni?.college) {
            return res.status(400).json({
                success: false,
                message: "Alumni college information not found",
            });
        }

        if (student.college.matchingName !== alumni.college.matchingName) {
            return res.status(403).json({
                success: false,
                message: "You can only download resumes of students from your college",
            });
        }

        if (!student.resume?.data) {
            return res.status(404).json({
                success: false,
                message: "No resume found for this student",
            });
        }

        res.setHeader('Content-Type', student.resume.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${student.resume.fileName}"`);
        res.setHeader('Content-Length', student.resume.fileSize);

        return res.send(student.resume.data);

    } catch (error) {
        console.error("Download student resume error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to download resume. Please try again.",
        });
    }
};

// GET /applications - returns dynamically grouped pending/applied applications
export const getGroupedApplications = async (req, res) => {
    try {
        const alumniId = req.user.id;

        const applications = await Application.find({
            alumni: alumniId,
            status: { $in: ["pending", "Applied"] }
        })
        .populate('student', 'firstName lastName email college branch graduationYear skills profileCompleteness image cgpa resume')
        .populate('opportunity', 'jobTitle experienceLevel')
        .sort({ createdAt: -1 });

        const applicationsWithChat = await Promise.all(applications.map(async (app) => {
            const chat = await Chat.findOneAndUpdate(
                { student: app.student._id, alumni: alumniId },
                { $setOnInsert: { student: app.student._id, alumni: alumniId } },
                { upsert: true, new: true, returnDocument: 'after' }
            );
            const appObj = app.toObject();
            appObj.chatId = chat ? chat._id : null;
            return appObj;
        }));

        const grouped = {};
        for (const app of applicationsWithChat) {
            const roleName = app.opportunity?.jobTitle || "Other Opportunity";
            if (!grouped[roleName]) {
                grouped[roleName] = [];
            }
            grouped[roleName].push(app);
        }

        return res.status(200).json({
            success: true,
            total: applicationsWithChat.length,
            data: grouped,
            message: "Pending applications grouped successfully",
        });
    } catch (error) {
        console.error("Get grouped applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending applications",
        });
    }
};

// POST /applications/:id/approve - approve a pending application
export const approveApplication = async (req, res) => {
    console.log("=== APPROVE APPLICATION START ===");
    console.log("Request params id:", req.params.id);
    console.log("Request user:", req.user);
    try {
        const alumniId = req.user.id || req.user._id;
        const { id } = req.params;

        const application = await Application.findById(id)
            .populate('opportunity')
            .populate('student', 'firstName lastName email');

        console.log("Fetched application:", application);

        if (!application) {
            console.log("Application not found for ID:", id);
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const opportunity = await Opportunity.findById(application.opportunity?._id || application.opportunity);
        console.log("Fetched opportunity:", opportunity);

        if (!opportunity) {
            console.log("Opportunity not found for Application:", application);
            return res.status(404).json({
                success: false,
                message: "Associated opportunity not found",
            });
        }

        if (opportunity.postedBy.toString() !== alumniId) {
            console.log("Unauthorized alumni approval attempt:", { postedBy: opportunity.postedBy, alumniId });
            return res.status(403).json({
                success: false,
                message: "You are not authorized to approve this application",
            });
        }

        application.status = "approved";
        application.referredAt = new Date();
        application.approvedAt = new Date();
        application.approvedBy = alumniId;

        if (!application.statusHistory) {
            application.statusHistory = [];
        }
        application.statusHistory.push({
            status: "approved",
            timestamp: new Date(),
            note: "Application approved by alumni"
        });

        await application.save();
        console.log("Application status approved saved successfully.");

        opportunity.referralsGiven = (opportunity.referralsGiven || 0) + 1;
        if (opportunity.referralsGiven >= opportunity.numberOfReferrals) {
            opportunity.status = "Closed";
        }
        await opportunity.save();
        console.log("Opportunity referralsGiven updated successfully.");

        try {
            await notificationService.createAndEmitNotification({
                recipientId: application.student._id || application.student,
                senderId: alumniId,
                type: 'REFERRAL',
                title: 'Application Approved!',
                message: `Your application for ${opportunity.jobTitle} has been approved!`,
                link: '/student/my-applications'
            });
        } catch (notifError) {
            console.error("Failed to emit notification in approveApplication:", notifError);
        }

        notificationService.emitToUser(alumniId, 'dashboard_refresh', { type: 'referral_update' });

        return res.status(200).json({
            success: true,
            data: application,
            message: "Application approved successfully",
        });
    } catch (error) {
        console.error("Approve application error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve application. Please try again.",
            error: error.message,
            stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
        });
    }
};

// POST /profile/image - upload profile image
export const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.accountType;
        
        if (!req.files || !req.files.profileImage) {
            return res.status(400).json({
                success: false,
                message: "Profile image file is required",
            });
        }
        
        const file = req.files.profileImage;
        const ext = path.extname(file.name);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const uploadDir = path.join(process.cwd(), "uploads");
        const uploadPath = path.join(uploadDir, filename);
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        await file.mv(uploadPath);
        
        let user;
        if (role === "alumni" || req.user.role === "alumni") {
            user = await Alumni.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: "Alumni not found" });
            user.image = filename;
            user.profileCompleteness = calculateAlumniProfileCompleteness(user);
            await user.save();
        } else {
            user = await Student.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: "Student not found" });
            user.image = filename;
            user.profileCompleteness = calculateProfileCompleteness(user);
            await user.save();
        }
        
        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            image: filename,
            data: user,
        });
    } catch (error) {
        console.error("Upload profile image error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload profile image",
        });
    }
};

// DELETE /profile/image - remove profile image
export const removeProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.accountType;
        
        let user;
        if (role === "alumni" || req.user.role === "alumni") {
            user = await Alumni.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: "Alumni not found" });
            user.image = `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName}%20${user.lastName}`;
            user.profileCompleteness = calculateAlumniProfileCompleteness(user);
            await user.save();
        } else {
            user = await Student.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: "Student not found" });
            user.image = `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName}%20${user.lastName}`;
            user.profileCompleteness = calculateProfileCompleteness(user);
            await user.save();
        }
        
        return res.status(200).json({
            success: true,
            message: "Profile image removed successfully",
            image: user.image,
            data: user,
        });
    } catch (error) {
        console.error("Remove profile image error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove profile image",
        });
    }
};