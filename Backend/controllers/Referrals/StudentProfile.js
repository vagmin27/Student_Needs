import Student from "../../models/Referrals/StudentModel.js";
import { embeddingService } from "../../services/ai/EmbeddingService.js";
import { calculateProfileCompleteness } from "../../utils/Referrals/calculateProfileScore.js";
import mongoose from "mongoose";

// Create / Update Profile
export const updateProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            degree,
            cgpa,
            bio,
            careerInterests,
            branch,
            graduationYear,
            skills,
            projects,
            certifications,
            preferredRoles,
            linkedinUrl,
            githubUrl,
            portfolioUrl,
        } = req.body;

        // Validate graduationYear if provided
        if (graduationYear && (graduationYear < 1900 || graduationYear > 2100)) {
            return res.status(400).json({
                success: false,
                message: "Invalid graduation year",
            });
        }

        // Validate cgpa if provided
        if (cgpa !== undefined && cgpa !== null && (cgpa < 0 || cgpa > 10)) {
            return res.status(400).json({
                success: false,
                message: "CGPA must be between 0.0 and 10.0",
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

        // Validate email uniqueness if changed
        if (email && email !== student.email) {
            const emailExists = await Student.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use by another account",
                });
            }
            student.email = email;
        }

        // Update fields if provided
        if (firstName !== undefined) student.firstName = firstName;
        if (lastName !== undefined) student.lastName = lastName;
        if (phoneNumber !== undefined) student.phoneNumber = phoneNumber;
        if (degree !== undefined) student.degree = degree;
        if (cgpa !== undefined) student.cgpa = cgpa;
        if (bio !== undefined) student.bio = bio;
        if (careerInterests !== undefined) student.careerInterests = careerInterests;
        if (branch !== undefined) student.branch = branch;
        if (graduationYear !== undefined) student.graduationYear = graduationYear;
        if (skills !== undefined) student.skills = skills;
        if (projects !== undefined) student.projects = projects;
        if (certifications !== undefined) student.certifications = certifications;
        if (preferredRoles !== undefined) student.preferredRoles = preferredRoles;
        if (linkedinUrl !== undefined) student.linkedinUrl = linkedinUrl;
        if (githubUrl !== undefined) student.githubUrl = githubUrl;
        if (portfolioUrl !== undefined) student.portfolioUrl = portfolioUrl;

        // Calculate and update profile completeness
        student.profileCompleteness = calculateProfileCompleteness(student);

        await student.save();

        // Populate college details
        await student.populate('college', 'name matchingName');

        // Trigger asynchronous embedding generation to update matching vectors
        const textToEmbed = `
            Student: ${student.firstName} ${student.lastName}
            Branch: ${student.branch}
            Skills: ${(student.skills || []).join(", ")}
        `.trim();
        embeddingService.generateEmbedding(textToEmbed)
            .then(vector => {
                Student.updateOne({ _id: student._id }, { $set: { embeddingVector: vector } }).exec();
            })
            .catch(console.error);

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
export const getProfile = async (req, res) => {
    try {
        const studentId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
             return res.status(400).json({ success: false, message: "Invalid student ID: " + studentId });
        }

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
        console.error("GET PROFILE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile. Please try again. Error: " + error.message,
        });
    }
};

// Get Profile Completion Status
export const getProfileStatus = async (req, res) => {
    try {
        const studentId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
             return res.status(400).json({ success: false, message: "Invalid student ID" });
        }

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
        if (!student.linkedinUrl) missingFields.push("linkedinUrl");
        if (!student.githubUrl) missingFields.push("githubUrl");
        if (!student.portfolioUrl) missingFields.push("portfolioUrl");

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
                    linkedIn: student.linkedinUrl ? "Complete" : "Incomplete",
                    github: student.githubUrl ? "Complete" : "Incomplete",
                    portfolio: student.portfolioUrl ? "Complete" : "Incomplete",
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