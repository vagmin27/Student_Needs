import mongoose from "mongoose";

const tutorSessionAttendanceSchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    sessionTime: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
    tutorName: {
      type: String,
      default: "",
    },
    studentName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

tutorSessionAttendanceSchema.index(
  { tutorId: 1, studentId: 1, subject: 1, date: 1, sessionTime: 1 },
  { unique: true }
);

export default mongoose.model(
  "TutorSessionAttendance",
  tutorSessionAttendanceSchema,
  "tutor_session_attendances"
);
