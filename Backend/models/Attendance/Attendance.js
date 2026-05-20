import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    attendanceRecords: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },

        attendance: {
          type: String,
          enum: ["present", "absent"],
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Prevent duplicate subject attendance same day
attendanceSchema.index(
  { date: 1, subject: 1 },
  { unique: true }
);

export default mongoose.model(
  "Attendance",
  attendanceSchema
);