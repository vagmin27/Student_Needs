import Alumni from "../models/AlumniModel.js";

// Create / Update Profile
export const updateProfile = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const {
            company,
            jobTitle,
            yearsOfExperience,
            skills,
            referralPreferences,
        } = req.body;

        // Validate yearsOfExperience if provided
        if (yearsOfExperience !== undefined && yearsOfExperience < 0) {
            return res.status(400).json({
                success: false,
                message: "Years of experience cannot be negative",
            });
        }

        // Find and update alumni
        const alumni = await Alumni.findById(alumniId);
        
        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: "Alumni not found",
            });
        }

        // Update fields if provided
        if (company !== undefined) alumni.company = company;
        if (jobTitle !== undefined) alumni.jobTitle = jobTitle;
        if (yearsOfExperience !== undefined) alumni.yearsOfExperience = yearsOfExperience;
        if (skills !== undefined) alumni.skills = skills;
        if (referralPreferences !== undefined) alumni.referralPreferences = referralPreferences;

        await alumni.save();

        // Populate college details
        await alumni.populate('college', 'name matchingName');

        // Remove password from response
        const alumniObject = alumni.toObject();
        alumniObject.password = undefined;

        return res.status(200).json({
            success: true,
            data: alumniObject,
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
        const alumniId = req.user.id;

        // Find alumni and populate college
        const alumni = await Alumni.findById(alumniId)
            .select("-password")
            .populate('college', 'name matchingName');

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: "Alumni not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: alumni,
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