const Application = require("../models/ApplicationModel");
const Opportunity = require("../models/OpportunityModel");
const Student = require("../models/StudentModel");
const Alumni = require("../models/AlumniModel");


// View Applications for an Opportunity
exports.viewApplications = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { opportunityId } = req.params;

        // Find opportunity
        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        // Check if the alumni is the owner of the opportunity
        if (opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view applications for this opportunity",
            });
        }

        // Find all applications for this opportunity
        const applications = await Application.find({
            opportunity: opportunityId,
        })
        .populate('student', 'firstName lastName email college branch graduationYear skills profileCompleteness image')
        .populate('opportunity', 'jobTitle experienceLevel')
        .sort({ createdAt: -1 });

        // Group applications by status
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
exports.viewStudentProfile = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { studentId } = req.params;

        // Find student with full details (exclude password and resume binary data)
        const student = await Student.findById(studentId)
            .select("-password -resume.data -linkedIn.data")
            .populate('college', 'name matchingName');
        // console.log(student);
        // console.log("new ");
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Verify that there's at least one application from this student to any opportunity posted by this alumni
        
        const alumni = await Alumni.findById(alumniId).populate('college', 'name matchingName');
        // console.log(alumni);
        if (!alumni || !alumni.college._id) {
            return res.status(400).json({
                success: false,
                message: "Alumni college information not found",
            });
        }

        // Check if student is from the same college
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
exports.shortlistStudent = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { applicationId } = req.params;

        // Find application
        const application = await Application.findById(applicationId)
            .populate('opportunity')
            .populate('student', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Check if the alumni is the owner of the opportunity
        if (application.opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to shortlist this application",
            });
        }

        // Check if already shortlisted or referred
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

        // Update application status
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
exports.markAsReferred = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { applicationId } = req.params;

        // Find application
        const application = await Application.findById(applicationId)
            .populate('opportunity')
            .populate('student', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Check if the alumni is the owner of the opportunity
        if (application.opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this application",
            });
        }

        // Check if already referred
        if (application.status === "Referred") {
            return res.status(400).json({
                success: false,
                message: "Application is already marked as referred",
            });
        }

        // Check if referrals are still available
        const opportunity = await Opportunity.findById(application.opportunity._id);
        if (opportunity.referralsGiven >= opportunity.numberOfReferrals) {
            return res.status(400).json({
                success: false,
                message: "No more referral slots available for this opportunity",
            });
        }

        // Update application status
        application.status = "Referred";
        application.referredAt = new Date();
        
        // If not already shortlisted, set shortlisted date as well
        if (!application.shortlistedAt) {
            application.shortlistedAt = new Date();
        }

        await application.save();

        // Increment referralsGiven on the opportunity
        opportunity.referralsGiven += 1;
        
        // Auto-close opportunity if all referral slots are filled
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
exports.rejectApplication = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { applicationId } = req.params;

        // Find application
        const application = await Application.findById(applicationId)
            .populate('opportunity');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Check if the alumni is the owner of the opportunity
        if (application.opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this application",
            });
        }

        // Check if already referred
        if (application.status === "Referred") {
            return res.status(400).json({
                success: false,
                message: "Cannot reject an application that has been referred",
            });
        }

        // Update application status
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

// 5.1 Apply for Referral
exports.applyForReferral = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { opportunityId } = req.body;

        // Validate input
        if (!opportunityId) {
            return res.status(400).json({
                success: false,
                message: "Opportunity ID is required",
            });
        }

        // Find the student with college info
        const student = await Student.findById(studentId)
            .populate('college', 'name matchingName');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Check if resume is uploaded (resume is stored as binary data in MongoDB)
        if (!student.resume || !student.resume.data) {
            return res.status(400).json({
                success: false,
                message: "Please upload your resume before applying for referrals",
            });
        }

        // Find the opportunity with alumni and college info
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

        // Check if opportunity is still open
        if (opportunity.status !== "Open") {
            return res.status(400).json({
                success: false,
                message: "This opportunity is no longer accepting applications",
            });
        }

        // Check if referral slots are still available
        if (opportunity.referralsGiven >= opportunity.numberOfReferrals) {
            return res.status(400).json({
                success: false,
                message: "All referral slots for this opportunity have been filled",
            });
        }

        // Check college match
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

        // Check if already applied
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

        // Create profile snapshot
        const profileSnapshot = {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            branch: student.branch,
            graduationYear: student.graduationYear,
            skills: student.skills || [],
            profileCompleteness: student.profileCompleteness,
        };

        // Create resume snapshot (store reference info, not actual binary data)
        const resumeSnapshot = {
            fileName: student.resume.fileName,
            fileSize: student.resume.fileSize,
            contentType: student.resume.contentType,
            uploadedAt: student.resume.uploadedAt,
        };

        // Create application
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

        // Populate the created application for response
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
        
        // Handle duplicate key error
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

// 5.2 Application Status List - Get all applications for a student
exports.getMyApplications = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        // Build filter query
        const filter = { student: studentId };
        if (status && ["Applied", "Shortlisted", "Referred", "Rejected"].includes(status)) {
            filter.status = status;
        }

        // Get total count
        const totalCount = await Application.countDocuments(filter);

        // Find applications with pagination
        const applications = await Application.find(filter)
            .populate('opportunity', 'jobTitle roleDescription experienceLevel requiredSkills status')
            .populate('alumni', 'firstName lastName email company currentRole image')
            .sort({ appliedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Group by status for summary
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

// 5.3 Application Details - Get specific application details
exports.getApplicationDetails = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { applicationId } = req.params;

        // Find application
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

        // Verify the student owns this application
        if (application.student._id.toString() !== studentId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this application",
            });
        }

        // Build detailed response
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
            // Show the snapshot used during application
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

// Download Student Resume (Alumni - same college)
exports.downloadStudentResume = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { studentId } = req.params;

        // Find student with resume data
        const student = await Student.findById(studentId)
            .select('resume college')
            .populate('college', 'matchingName');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Verify alumni is from same college
        const alumni = await Alumni.findById(alumniId).populate('college', 'matchingName');
        
        if (!alumni || !alumni.college) {
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

        if (!student.resume || !student.resume.data) {
            return res.status(404).json({
                success: false,
                message: "No resume found for this student",
            });
        }

        // Set headers for PDF download
        res.setHeader('Content-Type', student.resume.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${student.resume.fileName}"`);
        res.setHeader('Content-Length', student.resume.fileSize);

        // Send the PDF file
        return res.send(student.resume.data);

    } catch (error) {
        console.error("Download student resume error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to download resume. Please try again.",
        });
    }
};