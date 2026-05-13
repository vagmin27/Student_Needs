import Opportunity from "../models/OpportunityModel.js";
import Alumni from "../models/AlumniModel.js";
import Student from "../models/StudentModel.js"; // Moved from dynamic require

// Post Referral Opportunity
export const createOpportunity = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const {
            jobTitle,
            roleDescription,
            requiredSkills,
            experienceLevel,
            numberOfReferrals,
        } = req.body;

        // Validate required fields
        if (!jobTitle || !roleDescription || !experienceLevel || !numberOfReferrals) {
            return res.status(400).json({
                success: false,
                message: "Job title, role description, experience level, and number of referrals are required",
            });
        }

        // Validate numberOfReferrals
        if (numberOfReferrals < 1) {
            return res.status(400).json({
                success: false,
                message: "Number of referrals must be at least 1",
            });
        }

        // Find alumni to get college
        const alumni = await Alumni.findById(alumniId);
        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: "Alumni not found",
            });
        }

        if (!alumni.college) {
            return res.status(400).json({
                success: false,
                message: "Alumni must be associated with a college",
            });
        }

        // Create opportunity
        const opportunity = await Opportunity.create({
            jobTitle,
            roleDescription,
            requiredSkills: requiredSkills || [],
            experienceLevel,
            numberOfReferrals,
            postedBy: alumniId,
            college: alumni.college,
            status: "Open",
        });

        // Populate alumni and college details
        await opportunity.populate([
            { path: 'postedBy', select: 'firstName lastName email company jobTitle' },
            { path: 'college', select: 'name matchingName' }
        ]);

        return res.status(201).json({
            success: true,
            data: opportunity,
            message: "Referral opportunity created successfully",
        });

    } catch (error) {
        console.error("Create opportunity error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create opportunity. Please try again.",
        });
    }
};

// Update Referral Opportunity
export const updateOpportunity = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { opportunityId } = req.params;
        const {
            jobTitle,
            roleDescription,
            requiredSkills,
            experienceLevel,
            numberOfReferrals,
        } = req.body;

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
                message: "You are not authorized to update this opportunity",
            });
        }

        if (numberOfReferrals !== undefined && numberOfReferrals < 1) {
            return res.status(400).json({
                success: false,
                message: "Number of referrals must be at least 1",
            });
        }

        // Update fields if provided
        if (jobTitle !== undefined) opportunity.jobTitle = jobTitle;
        if (roleDescription !== undefined) opportunity.roleDescription = roleDescription;
        if (requiredSkills !== undefined) opportunity.requiredSkills = requiredSkills;
        if (experienceLevel !== undefined) opportunity.experienceLevel = experienceLevel;
        if (numberOfReferrals !== undefined) opportunity.numberOfReferrals = numberOfReferrals;

        await opportunity.save();

        await opportunity.populate([
            { path: 'postedBy', select: 'firstName lastName email company jobTitle' },
            { path: 'college', select: 'name matchingName' }
        ]);

        return res.status(200).json({
            success: true,
            data: opportunity,
            message: "Opportunity updated successfully",
        });

    } catch (error) {
        console.error("Update opportunity error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update opportunity. Please try again.",
        });
    }
};

// Close/Delete Referral Opportunity
export const deleteOpportunity = async (req, res) => {
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
                message: "You are not authorized to delete this opportunity",
            });
        }

        // Close the opportunity (soft delete)
        opportunity.status = "Closed";
        await opportunity.save();

        return res.status(200).json({
            success: true,
            message: "Opportunity closed successfully",
        });

    } catch (error) {
        console.error("Delete opportunity error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to close opportunity. Please try again.",
        });
    }
};

// View Posted Opportunities
export const getOpportunities = async (req, res) => {
    try {
        const userId = req.user.id;
        const accountType = req.user.accountType;

        let userCollege;

        if (accountType === "Student") {
            const student = await Student.findById(userId).select("college");
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                });
            }
            userCollege = student.college;
        } else if (accountType === "Alumni") {
            const alumni = await Alumni.findById(userId).select("college");
            if (!alumni) {
                return res.status(404).json({
                    success: false,
                    message: "Alumni not found",
                });
            }
            userCollege = alumni.college;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid account type",
            });
        }

        if (!userCollege) {
            return res.status(400).json({
                success: false,
                message: "User must be associated with a college",
            });
        }

        const opportunities = await Opportunity.find({
            college: userCollege,
            status: "Open",
        })
        .populate('postedBy', 'firstName lastName email company jobTitle')
        .populate('college', 'name matchingName')
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities,
            message: "Opportunities fetched successfully",
        });

    } catch (error) {
        console.error("Get opportunities error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch opportunities. Please try again.",
        });
    }
};

// Get Alumni's Own Posted Opportunities
export const getMyOpportunities = async (req, res) => {
    try {
        const alumniId = req.user.id;

        const opportunities = await Opportunity.find({
            postedBy: alumniId,
        })
        .populate('postedBy', 'firstName lastName email company jobTitle')
        .populate('college', 'name matchingName')
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities,
            message: "Your opportunities fetched successfully",
        });

    } catch (error) {
        console.error("Get my opportunities error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your opportunities. Please try again.",
        });
    }
};