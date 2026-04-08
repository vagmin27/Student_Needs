const Student = require("../models/StudentModel");
const { uploadPdfToMongoDB } = require("../utils/getStringFromPdf");
const { calculateProfileCompleteness } = require("../utils/calculateProfileScore");

exports.uploadLinkedIn = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { linkedInUrl } = req.body;

    if (!req.files || !req.files.linkedIn) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn PDF file is required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if LinkedIn PDF already exists
    if (student.linkedIn && student.linkedIn.data) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn PDF already exists. Use update endpoint to replace it.",
      });
    }

    // Upload PDF and get data
    const pdfData = await uploadPdfToMongoDB(req.files.linkedIn);

    // Store PDF in MongoDB with optional LinkedIn URL
    student.linkedIn = {
      ...pdfData,
      linkedInUrl: linkedInUrl || "",
    };
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        fileName: student.linkedIn.fileName,
        fileSize: student.linkedIn.fileSize,
        uploadedAt: student.linkedIn.uploadedAt,
        linkedInUrl: student.linkedIn.linkedIn,
        profileCompleteness: student.profileCompleteness,
      },
      message: "LinkedIn PDF uploaded successfully",
    });

  } catch (error) {
    console.error("Upload LinkedIn Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload LinkedIn PDF",
    });
  }
};

exports.updateLinkedInLink = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { linkedInUrl } = req.body;

    if (!linkedInUrl) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn URL is required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update only the LinkedIn URL, preserve PDF data if exists
    if (student.linkedIn) {
      student.linkedIn.linkedInUrl = linkedInUrl;
    } 
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        linkedInUrl: student.linkedIn.linkedInUrl,
        profileCompleteness: student.profileCompleteness,
      },
      message: "LinkedIn URL updated successfully",
    });

  } catch (error) {
    console.error("Update LinkedIn URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update LinkedIn URL",
    });
  }
};

exports.updateLinkedInPdf = async (req, res) => {
  try {
    const studentId = req.user.id;

    if (!req.files || !req.files.linkedIn) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn PDF file is required",
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
    const pdfData = await uploadPdfToMongoDB(req.files.linkedIn);

    // Update LinkedIn PDF in MongoDB, preserve the URL if exists
    student.linkedIn = {
      ...pdfData
    };

    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        fileName: student.linkedIn.fileName,
        fileSize: student.linkedIn.fileSize,
        uploadedAt: student.linkedIn.uploadedAt,
        profileCompleteness: student.profileCompleteness,
      },
      message: "LinkedIn PDF updated successfully",
    });

  } catch (error) {
    console.error("Update LinkedIn PDF Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update LinkedIn PDF",
    });
  }
};

exports.getLinkedIn = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId).select('linkedIn');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.linkedIn || !student.linkedIn.data) {
      return res.status(404).json({
        success: false,
        message: "No LinkedIn PDF found",
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', student.linkedIn.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${student.linkedIn.fileName}"`);
    res.setHeader('Content-Length', student.linkedIn.fileSize);

    // Send the PDF file
    return res.send(student.linkedIn.data);

  } catch (error) {
    console.error("Get LinkedIn Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve LinkedIn PDF",
    });
  }
};

exports.deleteLinkedIn = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.linkedIn || !student.linkedIn.data) {
      return res.status(404).json({
        success: false,
        message: "No LinkedIn PDF to delete",
      });
    }

    // Remove LinkedIn PDF from MongoDB
    student.linkedIn = undefined;
    student.profileCompleteness = calculateProfileCompleteness(student);
    
    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        profileCompleteness: student.profileCompleteness,
      },
      message: "LinkedIn PDF deleted successfully",
    });

  } catch (error) {
    console.error("Delete LinkedIn Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete LinkedIn PDF",
    });
  }
};