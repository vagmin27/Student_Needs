import Alumni from "../../models/Referrals/AlumniModel.js";

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

// Create / Update Profile
export const updateProfile = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const {
            firstName,
            lastName,
            company,
            jobTitle,
            yearsOfExperience,
            skills,
            referralPreferences,
            hiringInterests,
            linkedinUrl,
            githubUrl,
            portfolioUrl,
            bio,
            careerJourney,
            image,
        } = req.body;

        // Validate yearsOfExperience if provided
        if (yearsOfExperience !== undefined && yearsOfExperience !== null && yearsOfExperience < 0) {
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
        if (firstName !== undefined) alumni.firstName = firstName;
        if (lastName !== undefined) alumni.lastName = lastName;
        if (company !== undefined) alumni.company = company;
        if (jobTitle !== undefined) alumni.jobTitle = jobTitle;
        if (yearsOfExperience !== undefined) alumni.yearsOfExperience = yearsOfExperience;
        if (skills !== undefined) alumni.skills = skills;
        if (referralPreferences !== undefined) alumni.referralPreferences = referralPreferences;
        if (hiringInterests !== undefined) alumni.hiringInterests = hiringInterests;
        if (linkedinUrl !== undefined) alumni.linkedinUrl = linkedinUrl;
        if (githubUrl !== undefined) alumni.githubUrl = githubUrl;
        if (portfolioUrl !== undefined) alumni.portfolioUrl = portfolioUrl;
        if (bio !== undefined) alumni.bio = bio;
        if (careerJourney !== undefined) alumni.careerJourney = careerJourney;
        if (image !== undefined) alumni.image = image;

        // Calculate completeness
        alumni.profileCompleteness = calculateAlumniProfileCompleteness(alumni);

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