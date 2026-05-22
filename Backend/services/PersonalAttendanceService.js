import mongoose from "mongoose";
import AttendanceModel from "../models/Attendance/Attendance.js";
import SubjectModel from "../models/Attendance/Subject.js";
import { AppError } from "../utils/AppError.js";

const resolveUserId = (user) => {
  const id = user?._id || user?.id;
  if (!id) throw new AppError("User not authenticated", 401);
  return new mongoose.Types.ObjectId(id);
};

/** Normalize subjectId whether populated doc, ObjectId, or string */
const normalizeSubjectId = (subjectIdField) => {
  if (!subjectIdField) return null;
  if (typeof subjectIdField === "string") return subjectIdField;
  if (subjectIdField._id) return subjectIdField._id.toString();
  return subjectIdField.toString();
};

export class PersonalAttendanceService {
  static async getSubjects(user) {
    const userId = resolveUserId(user);
    return SubjectModel.find({ userId }).sort({ subjectName: 1 });
  }

  static async createSubject(user, { subjectName }) {
    const userId = resolveUserId(user);
    const trimmed = subjectName?.trim();
    if (!trimmed) throw new AppError("Subject name is required", 400);

    const existing = await SubjectModel.findOne({ userId, subjectName: trimmed });
    if (existing) throw new AppError("Subject already exists", 409);

    return SubjectModel.create({ userId, subjectName: trimmed });
  }

  static async updateSubject(user, subjectId, { subjectName }) {
    const userId = resolveUserId(user);
    const trimmed = subjectName?.trim();
    if (!trimmed) throw new AppError("Subject name is required", 400);

    const subject = await SubjectModel.findOne({ _id: subjectId, userId });
    if (!subject) throw new AppError("Subject not found", 404);

    const duplicate = await SubjectModel.findOne({
      userId,
      subjectName: trimmed,
      _id: { $ne: subjectId },
    });
    if (duplicate) throw new AppError("Subject already exists", 409);

    subject.subjectName = trimmed;
    await subject.save();
    return subject;
  }

  static async deleteSubject(user, subjectId) {
    const userId = resolveUserId(user);
    const subject = await SubjectModel.findOne({ _id: subjectId, userId });
    if (!subject) throw new AppError("Subject not found", 404);

    await AttendanceModel.deleteMany({ userId, subjectId });
    await subject.deleteOne();
    return { message: "Subject and related attendance deleted" };
  }

  static async markRecord(user, { subjectId, date, status }) {
    const userId = resolveUserId(user);
    const subjectOid = new mongoose.Types.ObjectId(subjectId);
    const normalizedDate = String(date).trim();

    const subject = await SubjectModel.findOne({ _id: subjectOid, userId });
    if (!subject) throw new AppError("Subject not found", 404);

    const existing = await AttendanceModel.findOne({
      userId,
      subjectId: subjectOid,
      date: normalizedDate,
    });
    if (existing) {
      throw new AppError(
        "Attendance already marked for this subject and date",
        409
      );
    }

    try {
      const record = await AttendanceModel.create({
        userId,
        subjectId: subjectOid,
        date: normalizedDate,
        status,
      });
      return { ...record.toObject(), subjectName: subject.subjectName };
    } catch (err) {
      if (err.code === 11000) {
        const keyPattern = err.keyPattern || err.keyValue || {};
        const keys = Object.keys(keyPattern).join(", ");
        const isLegacyIndex =
          keys.includes("subject") && !keys.includes("subjectId");
        throw new AppError(
          isLegacyIndex
            ? "Database index conflict: restart the server to sync attendance indexes, then try again"
            : "Attendance already marked for this subject and date",
          409
        );
      }
      throw err;
    }
  }

  static async getRecords(user, filters = {}) {
    const userId = resolveUserId(user);
    const query = { userId };

    if (filters.subjectId) {
      query.subjectId = new mongoose.Types.ObjectId(filters.subjectId);
    }
    if (filters.from || filters.to) {
      query.date = {};
      if (filters.from) query.date.$gte = filters.from;
      if (filters.to) query.date.$lte = filters.to;
    }

    const [records, subjectList] = await Promise.all([
      AttendanceModel.find(query).sort({ date: -1, createdAt: -1 }).lean(),
      SubjectModel.find({ userId }).select("_id subjectName").lean(),
    ]);

    const nameById = Object.fromEntries(
      subjectList.map((s) => [s._id.toString(), s.subjectName])
    );

    return records.map((r) => {
      const sid = normalizeSubjectId(r.subjectId);
      const subjectName = nameById[sid] || "Unknown";
      return {
        _id: r._id,
        id: r._id,
        subjectId: sid,
        subject: subjectName,
        subjectName,
        date: r.date,
        status: r.status,
        attendance: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });
  }

  static async updateRecord(user, recordId, { status, date, subjectId }) {
    const userId = resolveUserId(user);
    const record = await AttendanceModel.findOne({ _id: recordId, userId });
    if (!record) throw new AppError("Attendance record not found", 404);

    if (subjectId) {
      const subject = await SubjectModel.findOne({ _id: subjectId, userId });
      if (!subject) throw new AppError("Subject not found", 404);
      record.subjectId = new mongoose.Types.ObjectId(subjectId);
    }
    if (date) record.date = String(date).trim();
    if (status) record.status = status;

    const conflict = await AttendanceModel.findOne({
      userId,
      subjectId: record.subjectId,
      date: record.date,
      _id: { $ne: record._id },
    });
    if (conflict) {
      throw new AppError(
        "Attendance already marked for this subject and date",
        409
      );
    }

    try {
      await record.save();
      const populated = await AttendanceModel.findById(record._id).populate(
        "subjectId",
        "subjectName"
      );
      return {
        _id: populated._id,
        id: populated._id,
        subjectId: populated.subjectId?._id,
        subject: populated.subjectId?.subjectName,
        subjectName: populated.subjectId?.subjectName,
        date: populated.date,
        status: populated.status,
        attendance: populated.status,
      };
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError("Attendance already exists for this subject and date", 409);
      }
      throw err;
    }
  }

  static async deleteRecord(user, recordId) {
    const userId = resolveUserId(user);
    const record = await AttendanceModel.findOneAndDelete({ _id: recordId, userId });
    if (!record) throw new AppError("Attendance record not found", 404);
    return { message: "Attendance record deleted" };
  }

  static async getStats(user, filters = {}) {
    const userId = resolveUserId(user);
    const subjects = await SubjectModel.find({ userId }).sort({ subjectName: 1 }).lean();

    const recordQuery = { userId };
    if (filters.subjectId) {
      recordQuery.subjectId = new mongoose.Types.ObjectId(filters.subjectId);
    }

    const records = await AttendanceModel.find(recordQuery).lean();

    const bySubjectMap = {};
    subjects.forEach((s) => {
      const sid = s._id.toString();
      bySubjectMap[sid] = {
        subjectId: sid,
        subject: s.subjectName,
        subjectName: s.subjectName,
        total: 0,
        present: 0,
        absent: 0,
      };
    });

    records.forEach((r) => {
      const sid = normalizeSubjectId(r.subjectId);
      if (!sid || !bySubjectMap[sid]) return;

      bySubjectMap[sid].total++;
      if (r.status === "present") bySubjectMap[sid].present++;
      else bySubjectMap[sid].absent++;
    });

    const bySubject = Object.values(bySubjectMap).map((s) => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 1000) / 10 : 0,
      presentDays: s.present,
    }));

    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 1000) / 10 : 0;

    const lowAttendanceSubjects = bySubject.filter(
      (s) => s.total > 0 && s.percentage < 75
    );

    const timelineMap = {};
    records.forEach((r) => {
      const sid = normalizeSubjectId(r.subjectId);
      const key = `${sid}:${r.date}`;
      if (!timelineMap[key]) {
        timelineMap[key] = {
          date: r.date,
          subjectId: sid,
          subjectName: bySubjectMap[sid]?.subjectName || "Unknown",
          present: 0,
          absent: 0,
        };
      }
      if (r.status === "present") timelineMap[key].present++;
      else timelineMap[key].absent++;
    });
    const timeline = Object.values(timelineMap).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return {
      overall: { total, present, absent, percentage },
      bySubject,
      lowAttendanceSubjects,
      timeline,
    };
  }

  /** Flat list for legacy consumers (UnifiedDashboard) */
  static async getStudentAttendanceList(user) {
    return this.getRecords(user);
  }
}
