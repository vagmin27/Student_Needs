import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    meetingLink: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true } // ✅ keeps subdocument IDs (useful for updates later)
);

const userSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profile: {
      displayName: String,
      fName: String,
      lName: String,
      email: String,
      subjects: String,
      location: String,
    },

    pic: {
      type: String,
      default: null,
    },

    // ✅ MAIN SCHEDULE (REAL-TIME SYSTEM)
    schedule: [scheduleSchema],

    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt to user
);

// ✅ OPTIONAL: helps avoid duplicate slots (same date + time)
userSchema.index(
  { _id: 1, "schedule.date": 1, "schedule.time": 1 },
  { unique: false }
);

const User = mongoose.model("User", userSchema);

export default User;