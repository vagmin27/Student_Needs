import mongoose from "mongoose";
import TutorSessionAttendance from "../models/Attendance/TutorSessionAttendance.js";
import TutorSubject from "../models/Attendance/TutorSubject.js";
import Booking from "../models/Tutorials/Booking.js";
import TutorialsUser from "../models/Tutorials/user.js";
import ReferralStudent from "../models/Referrals/StudentModel.js";
import Tutor from "../models/Tutorials/Tutor.js";
import { AppError } from "../utils/AppError.js";

const toOid = (id) => {
  if (!id) return null;
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
};

const normalizeRole = (user) =>
  (user?.role || user?.accountType || "").toLowerCase();

const getTutorId = (user) => {
  const role = normalizeRole(user);
  if (role !== "tutor" && role !== "teacher") {
    throw new AppError("Only tutors can manage online class attendance", 403);
  }
  const id = user?._id || user?.id;
  if (!id) throw new AppError("User not authenticated", 401);
  return id.toString();
};

/** IDs that may represent the same student across Tutorials + Referrals login */
const resolveStudentIds = async (user) => {
  const directId = user?._id || user?.id;
  if (!directId) throw new AppError("User not authenticated", 401);

  const ids = new Set([directId.toString()]);
  const email =
    typeof user?.email === "string" ? user.email.trim().toLowerCase() : "";

  if (email) {
    const referral = await ReferralStudent.findOne({ email })
      .select("_id")
      .lean();
    if (referral) ids.add(referral._id.toString());

    const tutorialUser = await TutorialsUser.findOne({
      $or: [{ "profile.email": email }, { user: email }],
    })
      .select("_id")
      .lean();
    if (tutorialUser) ids.add(tutorialUser._id.toString());
  }

  return [...ids];
};

const displayNameFromTutorialUser = (doc) => {
  if (!doc) return "Student";
  const p = doc.profile || {};
  const fromProfile = [p.fName, p.lName].filter(Boolean).join(" ").trim();
  return (
    p.displayName ||
    fromProfile ||
    doc.user ||
    "Student"
  );
};

const displayNameFromReferral = (doc) => {
  if (!doc) return "Student";
  return `${doc.firstName || ""} ${doc.lastName || ""}`.trim() || "Student";
};

const loadStudentNames = async (studentIds) => {
  const oids = studentIds.map(toOid).filter(Boolean);
  const [tutorialUsers, referralStudents] = await Promise.all([
    TutorialsUser.find({ _id: { $in: oids } }).lean(),
    ReferralStudent.find({ _id: { $in: oids } }).lean(),
  ]);

  const nameById = new Map();
  for (const u of tutorialUsers) {
    nameById.set(u._id.toString(), displayNameFromTutorialUser(u));
  }
  for (const s of referralStudents) {
    nameById.set(s._id.toString(), displayNameFromReferral(s));
  }
  return nameById;
};

const normalizeSubjectKey = (name) =>
  (name || "").trim().toLowerCase();

const subjectMatches = (bookingSubject, tutorSubject) =>
  normalizeSubjectKey(bookingSubject) === normalizeSubjectKey(tutorSubject);

const normalizeDate = (d) => {
  if (!d) return d;
  if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  return d;
};

export class TutorAttendanceService {
  static async getTutorSubjects(tutorUser) {
    const tutorId = getTutorId(tutorUser);
    return TutorSubject.find({ tutorId }).sort({ subjectName: 1 });
  }

  static async createTutorSubject(tutorUser, { subjectName }) {
    const tutorId = getTutorId(tutorUser);
    const trimmed = subjectName?.trim();
    if (!trimmed) throw new AppError("Subject name is required", 400);

    try {
      return await TutorSubject.create({ tutorId, subjectName: trimmed });
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError("Subject already exists", 409);
      }
      throw err;
    }
  }

  static async updateTutorSubject(tutorUser, subjectId, { subjectName }) {
    const tutorId = getTutorId(tutorUser);
    const trimmed = subjectName?.trim();
    if (!trimmed) throw new AppError("Subject name is required", 400);

    const doc = await TutorSubject.findOne({ _id: subjectId, tutorId });
    if (!doc) throw new AppError("Subject not found", 404);

    if (normalizeSubjectKey(trimmed) === normalizeSubjectKey(doc.subjectName)) {
      return doc;
    }

    const hasRecords = await TutorSessionAttendance.exists({
      tutorId,
      subject: doc.subjectName,
    });
    if (hasRecords) {
      throw new AppError(
        "Cannot rename subject with existing attendance records",
        409
      );
    }

    const duplicate = await TutorSubject.findOne({
      tutorId,
      subjectName: trimmed,
      _id: { $ne: subjectId },
    });
    if (duplicate) throw new AppError("Subject already exists", 409);

    doc.subjectName = trimmed;
    await doc.save();
    return doc;
  }

  static async deleteTutorSubject(tutorUser, subjectId) {
    const tutorId = getTutorId(tutorUser);
    const doc = await TutorSubject.findOne({ _id: subjectId, tutorId });
    if (!doc) throw new AppError("Subject not found", 404);

    const recordCount = await TutorSessionAttendance.countDocuments({
      tutorId,
      subject: doc.subjectName,
    });
    if (recordCount > 0) {
      throw new AppError(
        "Cannot delete subject with existing attendance records",
        409
      );
    }

    await doc.deleteOne();
    return { message: "Subject deleted" };
  }

  static async assertTutorOwnsSubject(tutorId, subjectName) {
    const trimmed = subjectName?.trim();
    const owned = await TutorSubject.find({ tutorId }).lean();
    const doc = owned.find(
      (s) => normalizeSubjectKey(s.subjectName) === normalizeSubjectKey(trimmed)
    );
    if (!doc) {
      throw new AppError("Select a subject from your tutor subject list", 400);
    }
    return doc;
  }

  static async getEnrolledStudents(tutorUser, { subject }) {
    const tutorId = getTutorId(tutorUser);
    const tutorOid = toOid(tutorId);
    const trimmedSubject = subject?.trim();
    if (!trimmedSubject) {
      throw new AppError("Subject is required", 400);
    }

    const owned = await this.assertTutorOwnsSubject(tutorId, trimmedSubject);
    const canonicalSubject = owned.subjectName;

    const bookings = await Booking.find({
      tutorId: { $in: [tutorId, tutorOid] },
      status: { $ne: "Cancelled" },
    }).lean();

    const byStudent = new Map();

    for (const b of bookings) {
      if (!subjectMatches(b.subject, canonicalSubject)) continue;
      const sid = b.userId?.toString();
      if (!sid) continue;

      if (!byStudent.has(sid)) {
        byStudent.set(sid, { studentId: sid, bookingCount: 0 });
      }
      byStudent.get(sid).bookingCount += 1;
    }

    const studentIds = [...byStudent.keys()];
    const nameById = await loadStudentNames(studentIds);

    const students = studentIds.map((sid) => ({
      studentId: sid,
      name: nameById.get(sid) || "Student",
      bookingCount: byStudent.get(sid).bookingCount,
    }));

    students.sort((a, b) => a.name.localeCompare(b.name));
    return { subject: canonicalSubject, students };
  }

  static async getSessionRecords(tutorUser, { date, subject, sessionTime = "" }) {
    const tutorId = getTutorId(tutorUser);
    if (!subject) {
      throw new AppError("Subject is required", 400);
    }
    const owned = await this.assertTutorOwnsSubject(tutorId, subject);
    const canonicalSubject = owned.subjectName;
    const normalizedDate = normalizeDate(date);

    const filter = {
      tutorId,
      subject: canonicalSubject,
    };

    if (normalizedDate) {
      filter.date = normalizedDate;
    }
    if (sessionTime) {
      filter.sessionTime = sessionTime;
    }

    const records = await TutorSessionAttendance.find(filter)
      .sort({ date: -1, sessionTime: 1, studentName: 1, createdAt: -1 })
      .lean();

    return records;
  }

  static async markSessionAttendance(tutorUser, payload) {
    const tutorId = getTutorId(tutorUser);
    const { date, subject, sessionTime = "", records } = payload;

    if (!date || !subject || !Array.isArray(records) || records.length === 0) {
      throw new AppError("Date, subject, and at least one student record are required", 400);
    }
    const normalizedDate = normalizeDate(date);

    const owned = await this.assertTutorOwnsSubject(tutorId, subject);
    const canonicalSubject = owned.subjectName;

    const tutorDoc = await Tutor.findById(tutorId).select("name fName lName").lean();
    const tutorName =
      tutorDoc?.name ||
      [tutorDoc?.fName, tutorDoc?.lName].filter(Boolean).join(" ").trim() ||
      "Tutor";

    const studentIds = records.map((r) => r.studentId);
    const nameById = await loadStudentNames(studentIds);

    const enrolled = await this.getEnrolledStudents(tutorUser, {
      subject: canonicalSubject,
    });
    const allowedIds = new Set(enrolled.students.map((s) => s.studentId));

    const ops = [];
    for (const row of records) {
      const sid = row.studentId?.toString();
      if (!sid || !allowedIds.has(sid)) {
        throw new AppError("One or more students are not enrolled under this tutor", 403);
      }
      if (!["present", "absent"].includes(row.status)) {
        throw new AppError("Invalid attendance status", 400);
      }

      ops.push({
        updateOne: {
          filter: {
            tutorId,
            studentId: sid,
            subject: canonicalSubject,
            date: normalizedDate,
            sessionTime: sessionTime || "",
          },
          update: {
            $set: {
              status: row.status,
              tutorName,
              studentName: nameById.get(sid) || "Student",
            },
          },
          upsert: true,
        },
      });
    }

    await TutorSessionAttendance.bulkWrite(ops);

    return { message: "Attendance saved", count: ops.length };
  }

  static async getStudentSummary(studentUser) {
    const studentIds = await resolveStudentIds(studentUser);
    const oidList = studentIds.map(toOid).filter(Boolean);

    const records = await TutorSessionAttendance.find({
      studentId: { $in: oidList },
    })
      .sort({ date: -1 })
      .lean();

    const groups = new Map();

    for (const r of records) {
      const key = `${r.tutorId}|${r.subject}`;
      if (!groups.has(key)) {
        groups.set(key, {
          tutorId: r.tutorId.toString(),
          tutorName: r.tutorName || "Tutor",
          subject: r.subject,
          totalClasses: 0,
          classesAttended: 0,
          records: [],
        });
      }
      const g = groups.get(key);
      g.totalClasses += 1;
      if (r.status === "present") g.classesAttended += 1;
      g.records.push({
        id: r._id.toString(),
        date: r.date,
        sessionTime: r.sessionTime || "",
        status: r.status,
        subject: r.subject,
        tutorName: r.tutorName,
      });
    }

    const courses = [...groups.values()].map((g) => ({
      tutorId: g.tutorId,
      tutorName: g.tutorName,
      courseName: g.subject,
      totalClasses: g.totalClasses,
      classesAttended: g.classesAttended,
      attendancePercentage:
        g.totalClasses > 0
          ? Math.round((g.classesAttended / g.totalClasses) * 100)
          : 0,
      history: g.records.sort((a, b) => b.date.localeCompare(a.date)),
    }));

    courses.sort((a, b) => a.courseName.localeCompare(b.courseName));

    const overallTotal = courses.reduce((s, c) => s + c.totalClasses, 0);
    const overallAttended = courses.reduce((s, c) => s + c.classesAttended, 0);

    return {
      courses,
      overall: {
        totalClasses: overallTotal,
        classesAttended: overallAttended,
        attendancePercentage:
          overallTotal > 0
            ? Math.round((overallAttended / overallTotal) * 100)
            : 0,
      },
    };
  }

  static async getStudentHistory(studentUser, { tutorId, subject } = {}) {
    const studentIds = await resolveStudentIds(studentUser);
    const oidList = studentIds.map(toOid).filter(Boolean);

    const filter = { studentId: { $in: oidList } };
    if (tutorId) filter.tutorId = tutorId;
    if (subject) filter.subject = subject;

    return TutorSessionAttendance.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .lean();
  }
}
