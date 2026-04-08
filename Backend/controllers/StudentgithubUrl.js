import Student from "../models/StudentModel.js";
import { calculateProfileCompleteness } from "../utils/calculateProfileScore.js";

// Add GitHub URL (first time)
export const addGithubUrl = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: "GitHub URL is required",
      });
    }

    // Basic GitHub URL validation
    const githubUrlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
    if (!githubUrlPattern.test(githubUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL format. Example: https://github.com/username",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if GitHub URL already exists
    if (student.githubUrl) {
      return res.status(400).json({
        success: false,
        message: "GitHub URL already exists. Use update endpoint to change it.",
      });
    }

    // Add GitHub URL
    student.githubUrl = githubUrl;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        githubUrl: student.githubUrl,
        profileCompleteness: student.profileCompleteness,
      },
      message: "GitHub URL added successfully",
    });

  } catch (error) {
    console.error("Add GitHub URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add GitHub URL",
    });
  }
};

// Update GitHub URL
export const updateGithubUrl = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: "GitHub URL is required",
      });
    }

    // Basic GitHub URL validation
    const githubUrlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
    if (!githubUrlPattern.test(githubUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL format. Example: https://github.com/username",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update GitHub URL
    student.githubUrl = githubUrl;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        githubUrl: student.githubUrl,
        profileCompleteness: student.profileCompleteness,
      },
      message: "GitHub URL updated successfully",
    });

  } catch (error) {
    console.error("Update GitHub URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update GitHub URL",
    });
  }
};

// Get GitHub URL
export const getGithubUrl = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.githubUrl) {
      return res.status(404).json({
        success: false,
        message: "GitHub URL not found. Please add your GitHub URL first.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        githubUrl: student.githubUrl,
      },
      message: "GitHub URL retrieved successfully",
    });

  } catch (error) {
    console.error("Get GitHub URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve GitHub URL",
    });
  }
};

// Delete GitHub URL
export const deleteGithubUrl = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.githubUrl) {
      return res.status(404).json({
        success: false,
        message: "GitHub URL not found",
      });
    }

    // Delete GitHub URL
    student.githubUrl = undefined;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        profileCompleteness: student.profileCompleteness,
      },
      message: "GitHub URL deleted successfully",
    });

  } catch (error) {
    console.error("Delete GitHub URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete GitHub URL",
    });
  }
};