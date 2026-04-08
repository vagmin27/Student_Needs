import Student from "../models/StudentModel.js";
import { uploadPdfToMongoDB } from "../utils/getStringFromPdf.js";
import { calculateProfileCompleteness } from "../utils/calculateProfileScore.js";

export const uploadResume = async (req, res) => {
  try {
    const studentId = req.user.id;

    if (!req.files || !req.files.resume) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if resume already exists
    if (student.resume && student.resume.data) {
      return res.status(400).json({
        success: false,
        message: "Resume already exists. Use update endpoint to replace it.",
      });
    }

    // Upload PDF and get data
    const pdfData = await uploadPdfToMongoDB(req.files.resume);

    // Store PDF in MongoDB
    student.resume = pdfData;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        fileName: student.resume.fileName,
        fileSize: student.resume.fileSize,
        uploadedAt: student.resume.uploadedAt,
        profileCompleteness: student.profileCompleteness,
      },
      message: "Resume uploaded successfully",
    });

  } catch (error) {
    console.error("Upload Resume Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const studentId = req.user.id;

    if (!req.files || !req.files.resume) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Upload new PDF and get data
    const pdfData = await uploadPdfToMongoDB(req.files.resume);

    // Update resume in MongoDB
    student.resume = pdfData;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        fileName: student.resume.fileName,
        fileSize: student.resume.fileSize,
        uploadedAt: student.resume.uploadedAt,
        profileCompleteness: student.profileCompleteness,
      },
      message: "Resume updated successfully",
    });

  } catch (error) {
    console.error("Update Resume Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update resume",
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId).select('resume');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.resume || !student.resume.data) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', student.resume.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${student.resume.fileName}"`);
    res.setHeader('Content-Length', student.resume.fileSize);

    // Send the PDF file
    return res.send(student.resume.data);

  } catch (error) {
    console.error("Get Resume Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve resume",
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.resume || !student.resume.data) {
      return res.status(404).json({
        success: false,
        message: "No resume to delete",
      });
    }

    // Remove resume from MongoDB
    student.resume = undefined;
    student.profileCompleteness = calculateProfileCompleteness(student);
    
    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        profileCompleteness: student.profileCompleteness,
      },
      message: "Resume deleted successfully",
    });

  } catch (error) {
    console.error("Delete Resume Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};