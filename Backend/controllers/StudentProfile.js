const Student = require("../models/StudentModel");
const { calculateProfileCompleteness } = require("../utils/calculateProfileScore");

// Create / Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const {
            branch,
            graduationYear,
            skills,
            projects,
            certifications,
            preferredRoles,
        } = req.body;

        // Validate graduationYear if provided
        if (graduationYear && (graduationYear < 1900 || graduationYear > 2100)) {
            return res.status(400).json({
                success: false,
                message: "Invalid graduation year",
            });
        }

        // Find and update student
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Update fields if provided
        if (branch !== undefined) student.branch = branch;
        if (graduationYear !== undefined) student.graduationYear = graduationYear;
        if (skills !== undefined) student.skills = skills;
        if (projects !== undefined) student.projects = projects;
        if (certifications !== undefined) student.certifications = certifications;
        if (preferredRoles !== undefined) student.preferredRoles = preferredRoles;

        // Calculate and update profile completeness
        student.profileCompleteness = calculateProfileCompleteness(student);

        await student.save();

        // Populate college details
        await student.populate('college', 'name matchingName');

        // Remove password from response
        const studentObject = student.toObject();
        studentObject.password = undefined;

        return res.status(200).json({
            success: true,
            data: studentObject,
            message: "Profile updated successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile. Please try again.",
        });
    }
};

// Get Own Profile
exports.getProfile = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Find student and populate college
        const student = await Student.findById(studentId)
            .select("-password")
            .populate('college', 'name matchingName');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: student,
            message: "Profile fetched successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile. Please try again.",
        });
    }
};

// Get Profile Completion Status
exports.getProfileStatus = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Find student
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Calculate current profile completeness
        const completeness = calculateProfileCompleteness(student);

        // Determine missing fields
        const missingFields = [];
        if (!student.college) missingFields.push("college");
        if (!student.branch) missingFields.push("branch");
        if (!student.graduationYear) missingFields.push("graduationYear");
        if (!student.skills || student.skills.length === 0) missingFields.push("skills");
        if (!student.projects || student.projects.length === 0) missingFields.push("projects");
        if (!student.certifications || student.certifications.length === 0) missingFields.push("certifications");
        if (!student.preferredRoles || student.preferredRoles.length === 0) missingFields.push("preferredRoles");
        if (!student.resume || !student.resume.data) missingFields.push("resume");
        if (!student.linkedIn || !student.linkedIn.data) missingFields.push("linkedInPdf");
        if (!student.linkedIn || !student.linkedIn.linkedInUrl) missingFields.push("linkedInUrl");
        if (!student.githubUrl) missingFields.push("githubUrl");

        // Determine profile strength
        let strength = "Weak";
        if (completeness >= 80) strength = "Strong";
        else if (completeness >= 50) strength = "Medium";

        return res.status(200).json({
            success: true,
            data: {
                completeness: completeness,
                strength: strength,
                missingFields: missingFields,
                breakdown: {
                    basicInfo: student.firstName && student.lastName && student.email ? "Complete" : "Incomplete",
                    college: student.college ? "Complete" : "Incomplete",
                    academic: student.branch && student.graduationYear ? "Complete" : "Incomplete",
                    skills: student.skills && student.skills.length > 0 ? "Complete" : "Incomplete",
                    projects: student.projects && student.projects.length > 0 ? "Complete" : "Incomplete",
                    certifications: student.certifications && student.certifications.length > 0 ? "Complete" : "Incomplete",
                    preferredRoles: student.preferredRoles && student.preferredRoles.length > 0 ? "Complete" : "Incomplete",
                    resume: student.resume && student.resume.data ? "Complete" : "Incomplete",
                    linkedIn: student.linkedIn && (student.linkedIn.data || student.linkedIn.linkedInUrl) ? "Complete" : "Incomplete",
                    github: student.githubUrl ? "Complete" : "Incomplete",
                }
            },
            message: "Profile status fetched successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile status. Please try again.",
        });
    }
};