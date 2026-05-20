import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

// ✅ Inline Schedule Schema
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

// ✅ Inline Tutor Schema
const tutorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
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
});

// ✅ Inline User Schema (from user.js)
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
      isSeeded: Boolean,
    },
    pic: {
      type: String,
      default: null,
    },
    schedule: [scheduleSchema],
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

// Create models
const Tutor = mongoose.model("Tutor", tutorSchema);
const User = mongoose.model("User", userSchema);

// ✅ Helper: Generate dates from today+1 to today+6
function generateScheduleDates() {
  const schedule = [];
  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  const today = new Date();

  for (let day = 1; day <= 6; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

    times.forEach((time) => {
      schedule.push({
        date: dateStr,
        time,
        isBooked: false,
        studentId: null,
        meetingLink: "",
        subject: "",
        createdAt: new Date(),
      });
    });
  }

  return schedule;
}

// ✅ Main seed function
async function seedDB() {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/TutorsApp";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB via Mongoose");

    // ✅ Delete previous seeded data
    await Tutor.deleteMany({});
    console.log("🗑️  Cleared Tutor collection");

    await User.deleteMany({ "profile.isSeeded": true });
    console.log("🗑️  Cleared seeded User documents");

    // ✅ Generate 8 tutors with realistic data
    const password = await bcrypt.hash("password123", 10);
    const tutorsData = [
      {
        name: "Dr. Alice Johnson",
        fName: "Alice",
        lName: "Johnson",
        email: "alice.johnson@tutors.com",
        contact: "+1-555-0101",
        location: "New York, NY",
        education: "M.S. Computer Science, MIT",
        experience: "8 years of teaching experience",
        expertise: "JavaScript, Python, React, Node.js",
        hourlyRate: 50,
        stars: 4.8,
        numRatings: 127,
        reviews: ["Excellent instructor", "Very patient and knowledgeable"],
        password,
        schedule: generateScheduleDates(),
      },
      {
        name: "Prof. Bob Smith",
        fName: "Bob",
        lName: "Smith",
        email: "bob.smith@tutors.com",
        contact: "+1-555-0102",
        location: "San Francisco, CA",
        education: "B.S. Mathematics, Stanford",
        experience: "10 years of tutoring",
        expertise: "Calculus, Linear Algebra, Statistics",
        hourlyRate: 45,
        stars: 4.7,
        numRatings: 98,
        reviews: ["Great at explaining complex concepts"],
        password,
        schedule: generateScheduleDates(),
      },
      {
        name: "Ms. Carol Lee",
        fName: "Carol",
        lName: "Lee",
        email: "carol.lee@tutors.com",
        contact: "+1-555-0103",
        location: "Los Angeles, CA",
        education: "M.A. English Literature, Harvard",
        experience: "6 years of teaching",
        expertise: "English, Literature, Writing, Grammar",
        hourlyRate: 40,
        stars: 4.9,
        numRatings: 156,
        reviews: ["Inspiring and engaging"],
        password,
        schedule: generateScheduleDates(),
      },
      {
        name: "Dr. David Chen",
        fName: "David",
        lName: "Chen",
        email: "david.chen@tutors.com",
        contact: "+1-555-0104",
        location: "Boston, MA",
        education: "Ph.D. Physics, MIT",
        experience: "12 years of research and teaching",
        expertise: "Physics, Quantum Mechanics, Thermodynamics",
        hourlyRate: 60,
        stars: 4.6,
        numRatings: 89,
        reviews: ["Deepest knowledge in the field"],
        password,
        schedule: generateScheduleDates(),
      },
      {
        name: "Ms. Elena Garcia",
        fName: "Elena",
        lName: "Garcia",
        email: "elena.garcia@tutors.com",
        contact: "+1-555-0105",
        location: "Miami, FL",
        education: "B.S. Biology, University of Florida",
        experience: "5 years of tutoring",
        expertise: "Biology, Chemistry, Anatomy",
        hourlyRate: 42,
        stars: 4.5,
        numRatings: 73,
        reviews: ["Clear explanations"],
        password,
        schedule: generateScheduleDates(),
      },
      {
        name: "Prof. Frank Wilson",
        fName: "Frank",
        lName: "Wilson",
        email: "frank.wilson@tutors.com",
        contact: "+1-555-0106",
        location: "Chicago, IL",
        education: "M.B.A. Business Administration, Northwestern",
        experience: "15 years in education",
        expertise: "Economics, Business, Finance",
        hourlyRate: 55,
        stars: 4.7,
        numRatings: 112,
        reviews: ["Practical and insightful"],
        password,
        schedule: generateScheduleDates(),
      },
      {
        name: "Dr. Grace Martinez",
        fName: "Grace",
        lName: "Martinez",
        email: "grace.martinez@tutors.com",
        contact: "+1-555-0107",
        location: "Denver, CO",
        education: "M.S. Data Science, CMU",
        experience: "7 years of tech education",
        expertise: "Python, Machine Learning, Data Science",
        hourlyRate: 65,
        stars: 4.8,
        numRatings: 145,
        reviews: ["Expert in modern technologies"],
        password,
        schedule: generateScheduleDates(),
      },
      {
        name: "Prof. Henry Thompson",
        fName: "Henry",
        lName: "Thompson",
        email: "henry.thompson@tutors.com",
        contact: "+1-555-0108",
        location: "Seattle, WA",
        education: "B.A. History, University of Washington",
        experience: "9 years of teaching",
        expertise: "History, Political Science, Social Studies",
        hourlyRate: 38,
        stars: 4.4,
        numRatings: 61,
        reviews: ["Makes history come alive"],
        password,
        schedule: generateScheduleDates(),
      },
    ];

    const insertedTutors = await Tutor.insertMany(tutorsData);
    console.log(`🎓 Inserted ${insertedTutors.length} tutors`);

    // ✅ Generate 2 student users
    const studentPassword = await bcrypt.hash("student123", 10);
    const studentsData = [
      {
        user: "student1@example.com",
        password: studentPassword,
        profile: {
          displayName: "John Doe",
          fName: "John",
          lName: "Doe",
          email: "student1@example.com",
          subjects: "Math, Physics",
          location: "New York, NY",
          isSeeded: true,
        },
        pic: null,
        schedule: [],
        history: [],
      },
      {
        user: "student2@example.com",
        password: studentPassword,
        profile: {
          displayName: "Jane Smith",
          fName: "Jane",
          lName: "Smith",
          email: "student2@example.com",
          subjects: "English, History",
          location: "San Francisco, CA",
          isSeeded: true,
        },
        pic: null,
        schedule: [],
        history: [],
      },
    ];

    const insertedStudents = await User.insertMany(studentsData);
    console.log(`👨‍🎓 Inserted ${insertedStudents.length} students`);

    console.log("\n✨ SEED COMPLETE:");
    console.log(`   - ${insertedTutors.length} tutors with schedules`);
    console.log(`   - ${insertedStudents.length} students`);

    process.exit(0);
  } catch (err) {
    console.error("❌ SEED ERROR:", err);
    process.exit(1);
  }
}

seedDB();