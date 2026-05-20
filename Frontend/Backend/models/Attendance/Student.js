import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },

    Register_number: {
      type: String,
      required: true,
      unique: true,
    },

    Year_of_studying: {
      type: String,
    },

    Branch_of_studying: {
      type: String,
    },

    Gender: {
      type: String,
    },

    Mobile_number: {
      type: String,
    },

    Email_id: {
      type: String,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Attendance Status
    // status: {
    //   type: String,
    //   enum: ["Present", "Absent", ""],
    //   default: "",
    // },
  },
  { timestamps: true }
);

const AttendanceStudent =
  mongoose.models.AttendanceStudent ||
  mongoose.model("AttendanceStudent", studentSchema);

export default AttendanceStudent;