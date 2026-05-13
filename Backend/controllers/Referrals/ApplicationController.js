import Application from "../models/ApplicationModel.js";
import Opportunity from "../models/OpportunityModel.js";
import Student from "../models/StudentModel.js";
import Alumni from "../models/AlumniModel.js";

// =====================================================
// ALUMNI SIDE - Management Endpoints
// =====================================================

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

        const groupedApplications = {
            applied: applications.filter(app => app.status === "Applied"),
            shortlisted: applications.filter(app => app.status === "Shortlisted"),
            referred: applications.filter(app => app.status === "Referred"),
            rejected: applications.filter(app => app.status === "Rejected"),
        };

        return res.status(200).json({
            success: true,
            total: applications.length,
            data: {
                all: applications,
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
        const alumniId = req.user.id;
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

        if (application.opportunity.postedBy.toString() !== alumniId) {
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
        await application.save();

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
        const alumniId = req.user.id;
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

        if (application.opportunity.postedBy.toString() !== alumniId) {
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

        const opportunity = await Opportunity.findById(application.opportunity._id);
        if (opportunity.referralsGiven >= opportunity.numberOfReferrals) {
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

        await application.save();

        opportunity.referralsGiven += 1;
        
        if (opportunity.referralsGiven >= opportunity.numberOfReferrals) {
            opportunity.status = "Closed";
        }
        await opportunity.save();

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
    try {
        const alumniId = req.user.id;
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId)
            .populate('opportunity');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        if (application.opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this application",
            });
        }

        if (application.status === "Referred") {
            return res.status(400).json({
                success: false,
                message: "Cannot reject an application that has been referred",
            });
        }

        application.status = "Rejected";
        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application rejected successfully",
        });

    } catch (error) {
        console.error("Reject application error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject application. Please try again.",
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
            status: "Applied",
            studentDetails: {
                profileScore: req.body.profileScore || null,
                interviewScore: req.body.interviewScore || null,
            },
            profileSnapshot,
            resumeSnapshot,
            appliedAt: new Date(),
            statusHistory: [{
                status: "Applied",
                timestamp: new Date(),
                note: "Application submitted",
            }],
        });

        const populatedApplication = await Application.findById(application._id)
            .populate('opportunity', 'jobTitle roleDescription experienceLevel requiredSkills')
            .populate('alumni', 'firstName lastName company currentRole');

        return res.status(201).json({
            success: true,
            data: {
                application: populatedApplication,
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
        if (status && ["Applied", "Shortlisted", "Referred", "Rejected"].includes(status)) {
            filter.status = status;
        }

        const totalCount = await Application.countDocuments(filter);

        const applications = await Application.find(filter)
            .populate('opportunity', 'jobTitle roleDescription experienceLevel requiredSkills status')
            .populate('alumni', 'firstName lastName email company currentRole image')
            .sort({ appliedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const allApplications = await Application.find({ student: studentId });
        const statusSummary = {
            applied: allApplications.filter(app => app.status === "Applied").length,
            shortlisted: allApplications.filter(app => app.status === "Shortlisted").length,
            referred: allApplications.filter(app => app.status === "Referred").length,
            rejected: allApplications.filter(app => app.status === "Rejected").length,
        };

        return res.status(200).json({
            success: true,
            data: {
                applications,
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

        const applicationDetails = {
            _id: application._id,
            status: application.status,
            appliedAt: application.appliedAt,
            shortlistedAt: application.shortlistedAt,
            referredAt: application.referredAt,
            rejectedAt: application.rejectedAt,
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