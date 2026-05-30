import Student from "../../models/Referrals/StudentModel.js";
import { calculateProfileCompleteness } from "../../utils/Referrals/calculateProfileScore.js";

// Validation helper for Portfolio URL
const validateUrl = (url) => {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// Add Portfolio URL
export const addPortfolioUrl = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { portfolioUrl } = req.body;

    if (!portfolioUrl) {
      return res.status(400).json({
        success: false,
        message: "Portfolio URL is required",
      });
    }

    const trimmedUrl = portfolioUrl.trim();

    if (!validateUrl(trimmedUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format. Example: https://myportfolio.com",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.portfolioUrl) {
      return res.status(400).json({
        success: false,
        message: "Portfolio URL already exists. Use update endpoint to change it.",
      });
    }

    student.portfolioUrl = trimmedUrl;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        portfolioUrl: student.portfolioUrl,
        profileCompleteness: student.profileCompleteness,
      },
      message: "Portfolio URL added successfully",
    });
  } catch (error) {
    console.error("Add Portfolio URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to add Portfolio URL",
    });
  }
};

// Update Portfolio URL
export const updatePortfolioUrl = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { portfolioUrl } = req.body;

    if (!portfolioUrl) {
      return res.status(400).json({
        success: false,
        message: "Portfolio URL is required",
      });
    }

    const trimmedUrl = portfolioUrl.trim();

    if (!validateUrl(trimmedUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format. Example: https://myportfolio.com",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.portfolioUrl = trimmedUrl;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        portfolioUrl: student.portfolioUrl,
        profileCompleteness: student.profileCompleteness,
      },
      message: "Portfolio URL updated successfully",
    });
  } catch (error) {
    console.error("Update Portfolio URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update Portfolio URL",
    });
  }
};

// Get Portfolio URL
export const getPortfolioUrl = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.portfolioUrl) {
      return res.status(404).json({
        success: false,
        message: "Portfolio URL not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        portfolioUrl: student.portfolioUrl,
      },
      message: "Portfolio URL retrieved successfully",
    });
  } catch (error) {
    console.error("Get Portfolio URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve Portfolio URL",
    });
  }
};

// Delete Portfolio URL
export const deletePortfolioUrl = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.portfolioUrl = undefined;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        profileCompleteness: student.profileCompleteness,
      },
      message: "Portfolio URL deleted successfully",
    });
  } catch (error) {
    console.error("Delete Portfolio URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete Portfolio URL",
    });
  }
};
