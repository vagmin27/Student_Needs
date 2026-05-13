// utils/getStringFromPdf.js

import fs from "fs";

/**
 * Uploads PDF to MongoDB
 */
export const uploadPdfToMongoDB = async (resumeFile) => {
  try {
    if (!resumeFile) {
      throw new Error("Resume file is required");
    }

    if (!resumeFile.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are allowed");
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (resumeFile.size > maxSize) {
      throw new Error("File size should not exceed 2MB");
    }

    // Read file buffer
    const fileData = fs.readFileSync(resumeFile.tempFilePath);

    // Delete temp file
    fs.unlinkSync(resumeFile.tempFilePath);

    return {
      data: fileData,
      contentType: resumeFile.mimetype,
      fileName: resumeFile.name,
      fileSize: resumeFile.size,
      uploadedAt: new Date(),
    };

  } catch (error) {
    if (resumeFile?.tempFilePath && fs.existsSync(resumeFile.tempFilePath)) {
      fs.unlinkSync(resumeFile.tempFilePath);
    }
    throw error;
  }
};