import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  date: String,
  time: String,
  isBooked: { type: Boolean, default: false },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  meetingLink: { type: String, default: "" },
  subject: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const tutorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  // ✅ ADD THESE FIELDS
  fName: String,
  lName: String,
  contact: String,
  location: String,
  experience: String,
  expertise: String,
  profilePic: String,
  schedule: [scheduleSchema],
  stars: { type: Number, default: 4 },
  numRatings: { type: Number, default: 0 },
  reviews: [String],
  education: String,
  hourlyRate: Number,
  bio: String,
  subjects: [String],
  skills: [String],
  availableDays: [String],
  availableTimeSlots: [String],
  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  profileCompleteness: { type: Number, default: 0 },
});

export default mongoose.model("Tutor", tutorSchema);