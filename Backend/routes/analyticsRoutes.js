import express from "express";
import expenseModel from "../models/Expenses/expenseModel.js";
import Booking from "../models/Tutorials/Booking.js";
import GradeModel from "../models/Attendance/GradeModel.js";
import { catchAsync } from "../utils/catchAsync.js";

import mongoose from "mongoose";
import protect from "../middlewares/Attendance/authMiddleware.js";

const router = express.Router();

router.use(protect);

/**
 * GET /api/analytics/student-dashboard
 * Aggregates live data for the student dashboard.
 */
router.get("/student-dashboard", catchAsync(async (req, res) => {
  const userId = req.user._id || req.user.id;

  // 1. Fetch Expenses (group by category for pie chart)
  const expenses = await expenseModel.aggregate([
    { $match: { userId: userId, type: "expense" } },
    { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
    { $sort: { totalAmount: -1 } }
  ]);

  const expenseData = expenses.map(e => ({ name: e._id, value: e.totalAmount }));

  // 2. Fetch Upcoming Bookings (Tasks)
  const upcomingBookings = await Booking.find({ 
    userId: userId, 
    status: { $in: ["Booked"] } 
  }).sort({ date: 1 }).limit(5);

  const upcomingTasks = upcomingBookings.map(b => ({
    id: b._id,
    title: `Class with ${b.tutorName}`,
    subject: b.subject,
    date: b.date,
    time: b.time,
    status: "Pending"
  }));

  // 3. Fetch CGPA Data (Aggregate grades by semester)
  const gradesAggr = await GradeModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: {
        _id: { semester: "$semester", term: "$term" },
        totalGradePoints: { $sum: { $multiply: ["$gradePoint", "$credits"] } },
        totalCredits: { $sum: "$credits" }
    }},
    { $sort: { "_id.semester": 1 } }
  ]);

  const cgpaData = gradesAggr.map(g => ({
    term: g._id.term || `Semester ${g._id.semester}`,
    cgpa: Number((g.totalGradePoints / g.totalCredits).toFixed(2))
  }));

  res.status(200).json({
    success: true,
    data: {
      cgpaData,
      expenseData,
      upcomingTasks
    }
  });
}));

/**
 * GET /api/analytics/tutor-dashboard
 * Aggregates live data for the tutor dashboard.
 */
router.get("/tutor-dashboard", catchAsync(async (req, res) => {
  const tutorId = req.user._id || req.user.id;

  // 1. Fetch Recent Requests (Bookings where status is Pending/Booked)
  const recentBookings = await Booking.find({
    tutorId: tutorId.toString()
  }).sort({ createdAt: -1 }).limit(5);

  const recentRequests = recentBookings.map(b => ({
    id: b._id,
    studentName: b.userId?.toString?.().slice(0, 8) || "Student",
    subject: b.subject,
    date: b.date,
    time: b.time,
    status: b.status
  }));

  // 2. Activity Timeline (Just use bookings sorted by date as activity)
  const activityTimeline = recentBookings.map(b => ({
    id: b._id,
    type: "booking",
    title: `Class ${b.status}`,
    description: `Class for ${b.subject} on ${b.date}`,
    timestamp: b.createdAt
  }));

  res.status(200).json({
    success: true,
    data: {
      recentRequests,
      activityTimeline
    }
  });
}));

export default router;
