import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Tutor from "../../models/Tutorials/Tutor.js";
import Booking from "../../models/Tutorials/Booking.js";
import upload from "../../utils/Tutorials/multer.js";


// Temporary in-memory OTP store
const otpStore = {};



const router = express.Router();

// Helper function to require tutor session
const requireTutorSession = (req, res) => {
  const userId = req.session?.user?.id;
  const role = req.session?.user?.role;
  if (!userId || role !== "tutor") {
    res.status(401).json({ message: "Tutor not authenticated. Please log in." });
    return null;
  }
  return userId;
};

// ================= REGISTER (OTP FLOW) =================

// STEP 1 — Request OTP
router.post("/register/request-otp", async (req, res) => {
  console.log(`[Tutor OTP] Request received for email: ${req.body?.email}`);
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn("[Tutor OTP] Validation failed: missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Tutor.findOne({ email });
    if (existing) {
      console.warn(`[Tutor OTP] Registration failed: email ${email} is already registered`);
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore[email] = { otp, expires, name, password };
    console.log(`[Tutor OTP] Generated OTP: ${otp} for ${email}, expires at: ${new Date(expires).toISOString()}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log(`[Tutor OTP] Attempting to send email via SMTP to: ${email}`);
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Tutor Match — Tutor Registration OTP",
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2>
             <p>Valid for 10 minutes.</p>`,
    });
    console.log(`[Tutor OTP] OTP email successfully sent to: ${email}`);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("[Tutor OTP] Error during OTP request flow:", err);
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
});

// STEP 2 — Verify OTP and Register
router.post("/register/verify-otp", async (req, res) => {
  console.log(`[Tutor OTP] Verify OTP request received for email: ${req.body?.email}`);
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) {
      console.warn(`[Tutor OTP] Verification failed: No pending OTP record found for email: ${email}`);
      return res.status(400).json({ message: "No OTP found. Please request again." });
    }

    if (Date.now() > record.expires) {
      console.warn(`[Tutor OTP] Verification failed: OTP expired for email: ${email}`);
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired. Please request again." });
    }

    if (record.otp !== otp) {
      console.warn(`[Tutor OTP] Verification failed: Invalid OTP entered for email: ${email}. Expected: ${record.otp}, Entered: ${otp}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    console.log(`[Tutor OTP] OTP successfully verified for email: ${email}. Creating tutor database record.`);
    const hashedPassword = await bcrypt.hash(record.password, 10);

    const tutor = await Tutor.create({
      name: record.name,
      email,
      password: hashedPassword,
    });
    console.log(`[Tutor OTP] Tutor record created successfully. ID: ${tutor._id}`);

    delete otpStore[email];

    res.json({ status: "ok", message: "Tutor registered successfully", tutor });
  } catch (err) {
    console.error("[Tutor OTP] Error during verification or registration:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// ================= REGISTER (DIRECT - KEEP FOR NOW) =================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingTutor = await Tutor.findOne({ email });

    if (existingTutor) {
      return res.status(400).json({ message: "Tutor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const tutor = await Tutor.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ status: "ok", tutor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering tutor" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const tutor = await Tutor.findOne({ email });

    if (!tutor) {
      return res.status(401).json({ message: "Tutor not found" });
    }

    const isMatch = await bcrypt.compare(password, tutor.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ SESSION FIX
    req.session.user = {
      id: tutor._id,
      role: "tutor",
    };

    const token = jwt.sign(
      { id: tutor._id, role: "tutor" },
      process.env.JWT_SECRET || "mySuperSecretKey123",
      { expiresIn: "7d" }
    );

    res.json({ status: "ok", token, tutor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

// ================= AVAILABILITY =================
router.post("/availability", async (req, res) => {
  try {
    const tutorId = requireTutorSession(req, res);
    if (!tutorId) return;

    const { subjects, timeSlots } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const slot of timeSlots) {
      const [dateStr] = slot.split(" - ");
      if (new Date(dateStr) < today) {
        return res.status(400).json({ message: "Cannot add slots for past dates" });
      }
    }

    const formattedSlots = timeSlots.map((slot) => {
      const [date, time] = slot.split(" - ");

      return {
        date,
        time,
        isBooked: false,
        meetingLink: "",
        subject: subjects.join(", "),
      };
    });

    await Tutor.findByIdAndUpdate(tutorId, {
      $set: {
        expertise: subjects.join(", "),
      },
      $push: {
        schedule: { $each: formattedSlots },
      },
    });

    res.json({
      status: "ok",
      message: "Availability saved",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving availability" });
  }
});

router.get("/schedule", async (req, res) => {
  try {
    // Support both tutor session and student Passport session
    const tutorId = req.session?.user?.id;
    const studentId = req.session?.passport?.user;

    if (tutorId && req.session.user.role === "tutor") {
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) return res.status(404).json({ message: "Tutor not found" });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter out past slots
      const upcomingSlots = (tutor.schedule || []).filter((slot) => {
        const slotDate = new Date(slot.date);
        return slotDate >= today;
      });

      // If any slots were removed, save back to DB
      if (upcomingSlots.length !== (tutor.schedule || []).length) {
        tutor.schedule = upcomingSlots;
        await tutor.save();
      }

      return res.json({
        status: "ok",
        data: { schedule: upcomingSlots },
      });
    }

    if (studentId) {
      // Return student's booked classes from Booking model
      const bookings = await Booking.find({ userId: studentId });
      const schedule = bookings.map((b) => ({
        date: b.date,
        time: b.time,
        tutor: b.tutorName,
        subject: b.subject,
        tutor_ID: b.tutorId,
      }));
      return res.json({ status: "ok", data: { schedule } });
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching schedule" });
  }
});


// ================= SAVE MEETING LINK =================
router.post("/save-link", async (req, res) => {
  try {
    const tutorId = requireTutorSession(req, res);
    if (!tutorId) return;

    const { slotTime, link } = req.body;

    const [date, time] = slotTime.split(" - ");

    await Tutor.updateOne(
      {
        _id: tutorId,
        "schedule.date": date,
        "schedule.time": time,
      },
      {
        $set: {
          "schedule.$.meetingLink": link,
        },
      },
    );

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving link" });
  }
});

// ================= GET PROFILE =================
router.get("/profile", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tutor = await Tutor.findById(req.session.user.id);

    res.json({
      profile: tutor,
      pic: tutor?.profilePic || null,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ================= UPDATE PROFILE =================
router.put("/profile", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updated = await Tutor.findByIdAndUpdate(
      req.session.user.id,
      {
        name: req.body.displayName,
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        contact: req.body.contact,
        location: req.body.location,
        experience: req.body.experience,
        expertise: req.body.expertise,
      },
      { new: true },
    );

    res.json({
      msg: "Profile updated",
      profile: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// ================= UPLOAD PROFILE PIC =================
router.post(
  "/profile/upload",
  upload.single("profilePic"), // 🔥 Use same key as Student (profilePic)
  async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // ✅ Save the filename to Tutor model
      await Tutor.findByIdAndUpdate(req.session.user.id, {
        profilePic: req.file.filename,
      });

      res.json({
        status: "OK",
        filename: req.file.filename,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);


router.get("/:id/availability", async (req, res) => {
  try {
    const tutorId = req.params.id;

    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ msg: "Tutor not found" });
    }

    const availableSlots =
      tutor.schedule.filter((slot) => !slot.isBooked) || [];

    res.json({
      schedule: availableSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= DELETE SLOT =================
router.delete("/schedule/:slotId", async (req, res) => {
  try {
    const tutorId = req.session?.user?.id;

    if (!tutorId || req.session?.user?.role !== "tutor") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });

    const before = tutor.schedule.length;
    tutor.schedule = tutor.schedule.filter(
      (slot) => slot._id.toString() !== req.params.slotId
    );

    if (tutor.schedule.length === before) {
      return res.status(404).json({ message: "Slot not found" });
    }

    await tutor.save();
    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting slot" });
  }
});

export default router;