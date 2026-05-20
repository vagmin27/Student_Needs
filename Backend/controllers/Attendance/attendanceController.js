import fs from "fs";


import { AttendanceService } from "../../services/AttendanceService.js";
import { generateCsvData, generateDocxDocument } from "../../services/helpers/attendanceReport.helper.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { validateRequest, markAttendanceSchema, deleteAttendanceSchema, downloadReportSchema } from "../../validations/attendance.validation.js";

// ✅ MARK ATTENDANCE
export const markAttendance = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(markAttendanceSchema, req.body);
  if (!isValid) return res.status(400).json(errorResponse);

  const response = await AttendanceService.markAttendance(data);
  res.status(200).json(response);
});

// ✅ DOWNLOAD CSV REPORT
export const downloadAttendance = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(downloadReportSchema, req.query);
  if (!isValid) return res.status(400).json(errorResponse);

  const attendanceRecords = await AttendanceService.getAttendanceForDateRange(data.start, data.end);
  const csvFilePath = await generateCsvData(attendanceRecords, data.start, data.end);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=attendance_${data.start}_to_${data.end}.csv`);

  const stream = fs.createReadStream(csvFilePath);
  
  stream.on("error", (err) => {
    console.error("[Attendance] Stream read error:", err);
    if (!res.headersSent) res.status(500).json({ success: false, message: "Error reading report file" });
  });

  res.on("finish", () => {
    fs.unlink(csvFilePath, (err) => {
      if (err && err.code !== "ENOENT") console.error("[Attendance] Temp file cleanup error:", err);
    });
  });

  stream.pipe(res);
});


// ✅ DOWNLOAD DOCX
export const downloadTodayAttendance = catchAsync(async (req, res) => {
  const dateParam = req.params.date;
  if (!dateParam) return res.status(400).json({ success: false, message: "Date is required" });

  const attendanceRecord = await AttendanceService.getAttendanceForDate(dateParam);
  const docx = await generateDocxDocument(attendanceRecord, dateParam);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=attendance_${dateParam}.docx`
  );

  docx.generate(res);
});

// ✅ GET ALL ATTENDANCE
export const getAttendance = catchAsync(async (req, res) => {
  const attendance = await AttendanceService.getAllAttendance();
  res.status(200).json(attendance);
});

// ✅ GET STUDENT ATTENDANCE
export const getStudentAttendance = catchAsync(async (req, res) => {
  const studentId = req.user._id; // Assuming user is student
  const studentAttendance = await AttendanceService.getStudentAttendance(studentId);
  res.status(200).json(studentAttendance);
});

// ✅ DELETE STUDENT ATTENDANCE
export const deleteStudentAttendance = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(deleteAttendanceSchema, req.params);
  if (!isValid) return res.status(400).json(errorResponse);

  const response = await AttendanceService.deleteStudentAttendance(data);
  res.status(200).json(response);
});