import express from "express";
import expenseModel from "../models/Expenses/expenseModel.js";
import Booking from "../models/Tutorials/Booking.js";
import GradeModel from "../models/Attendance/GradeModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { computeActivityStatus } from "../utils/bookingActivityHelper.js";

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

  // 2. Fetch Recent Bookings for activity logic
  const allBookings = await Booking.find({ userId: userId }).sort({ createdAt: -1 });
  
  // Transform all bookings using the helper for consistency (student perspective)
  const activityTimeline = allBookings.map(b => ({
    id: b._id,
    ...b._doc,
    ...computeActivityStatus(b, true)
  }));

  const upcomingBookings = await Booking.find({ 
    userId: userId, 
    status: { $in: ["Booked", "pending", "upcoming", "scheduled", "accepted"] } 
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
      upcomingTasks,
      activityTimeline
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
  }).sort({ createdAt: -1 }).limit(10).populate("userId");

  const recentRequests = recentBookings.slice(0, 5).map(b => ({
    id: b._id,
    studentName: b.userId?.toString?.().slice(0, 8) || "Student",
    subject: b.subject,
    date: b.date,
    time: b.time,
    status: b.status
  }));

  // 2. Activity Timeline (Shared computed logic for tutor perspective)
  const activityTimeline = recentBookings.map(b => ({
    id: b._id,
    ...b._doc,
    ...computeActivityStatus(b, false)
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
