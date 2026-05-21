import mongoose from "mongoose";
import AttendanceModel from "../models/Attendance/Attendance.js";
import StudentModel from "../models/Attendance/Student.js";
import { AppError } from "../utils/AppError.js";

export class AttendanceService {
  
  static async getAllAttendance() {
    return await AttendanceModel.find();
  }

  static async getStudentAttendance(studentId) {
    let student = await StudentModel.findOne({ userId: studentId });
    if (!student) {
      // Fallback to finding the student by email from the ReferralStudent record
      const ReferralStudent = mongoose.models.ReferralStudent || mongoose.model("ReferralStudent");
      const refStudent = await ReferralStudent.findById(studentId);
      if (refStudent) {
        student = await StudentModel.findOne({ Email_id: refStudent.email });
      }
    }
    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const attendanceRecords = await AttendanceModel.find();
    
    return attendanceRecords.map(record => {
      const studentRecord = record.attendanceRecords.find(
        rec => rec.studentId.toString() === student._id.toString()
      );
      return {
        date: record.date,
        subject: record.subject,
        attendance: studentRecord ? studentRecord.attendance : null,
      };
    });
  }

  static async markAttendance({ subject, attendanceData, date }) {
    console.log("[AttendanceService] markAttendance invoked"); // Migration log
    
    const attendanceDate = date || new Date().toISOString().split("T")[0];
    const attendanceRecords = attendanceData.map((item) => ({
      studentId: item.studentId,
      attendance: item.attendance,
    }));

    await AttendanceModel.findOneAndUpdate(
      { date: attendanceDate, subject },
      { $set: { attendanceRecords } },
      { upsert: true, new: true }
    );
    
    return { message: "Attendance Updated" };
  }

  static async deleteStudentAttendance({ register, studentId }) {
    let id = studentId;

    if (register) {
      const student = await StudentModel.findOne({ Register_number: register });
      if (!student) {
        throw new AppError("Student not found", 404);
      }
      id = student._id;
    }

    await AttendanceModel.updateMany(
      {},
      {
        $pull: {
          attendanceRecords: { studentId: id },
        },
      }
    );
    
    return { message: "Attendance deleted successfully" };
  }

  static async getAttendanceForDateRange(startDate, endDate) {
    const attendanceRecords = await AttendanceModel.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("attendanceRecords.studentId");

    if (attendanceRecords.length === 0) {
      throw new AppError("Attendance data not found", 404);
    }

    return attendanceRecords;
  }

  static async getAttendanceForDate(dateParam) {
    const attendanceRecord = await AttendanceModel.findOne({
      date: new Date(dateParam),
    });

    if (!attendanceRecord) {
      throw new AppError("Attendance data not found", 404);
    }

    return attendanceRecord;
  }
}
