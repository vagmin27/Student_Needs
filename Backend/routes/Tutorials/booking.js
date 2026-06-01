import express from "express";
import mongoose from "mongoose";
import Booking from "../../models/Tutorials/Booking.js";
import Tutor from "../../models/Tutorials/Tutor.js";
import { notificationService } from "../../services/NotificationService.js";
import { resolveBookingStudentId } from "../../utils/Tutorials/resolveBookingStudentId.js";

const router = express.Router();

/**
 * ✅ CREATE BOOKING (FROM FRONTEND)
 */
import jwt from "jsonwebtoken";

router.post("/", async (req, res) => {
  try {
    const userId = resolveBookingStudentId(req);

    if (!userId) {
      return res.status(401).json({ msg: "Please log in to book a class" });
    }

    const { tutorId, tutorName, subject, date, time } = req.body;

    if (!tutorId || !subject || !date || !time) {
      return res.status(400).json({ msg: "Missing required booking fields" });
    }

    const booking = new Booking({
      userId,
      tutorId,
      tutorName: tutorName || "Tutor",
      subject,
      date,
      time,
      status: "Booked",
    });

    await booking.save();

    if (tutorId) {
      await Tutor.updateOne(
        {
          _id: tutorId,
          schedule: {
            $elemMatch: { date, time, isBooked: { $ne: true } },
          },
        },
        {
          $set: {
            "schedule.$.isBooked": true,
            "schedule.$.studentId": userId,
            ...(subject ? { "schedule.$.subject": subject } : {}),
          },
        }
      );

      await notificationService.createAndEmitNotification({
        recipientId: tutorId,
        type: "BOOKING",
        title: "New Class Booked",
        message: `A student has booked a class for ${subject} on ${date} at ${time}.`,
        link: "/tutorials/tutor/dashboard",
      });

      // Emit global refresh to the tutor so their dashboard instantly updates
      import("../../sockets/index.js").then(({ getIo }) => {
        const io = getIo();
        if (io) io.to(tutorId.toString()).emit("dashboard_refresh");
      });
    }

    res.status(201).json({ msg: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during booking" });
  }
});

/**
 * ✅ GET BOOKINGS
 */
router.get("/", async (req, res) => {
  try {
    const userId = resolveBookingStudentId(req);

    if (!userId) {
      return res.json([]);
    }

    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching bookings" });
  }
});

/**
 * ✅ DELETE BOOKING
 */
router.delete("/deleteClass/:id", async (req, res) => {
  try {
    const userId = resolveBookingStudentId(req);
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not your booking" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ msg: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting booking" });
  }
});

/**
 * ✅ GET BOOKINGS FOR TUTOR
 */
router.get("/for-tutor", async (req, res) => {
  try {
    const tutorId = req.session?.user?.id;

    if (!tutorId || req.session?.user?.role !== "tutor") {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!mongoose.isValidObjectId(tutorId)) {
      return res.status(400).json({ msg: "Invalid tutor ID" });
    }

    // Find ALL bookings for this tutor regardless of status
    const bookings = await Booking.find({
      tutorId: new mongoose.Types.ObjectId(tutorId),
    });

    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching tutor bookings" });
  }
});

/**
 * ✅ UPDATE BOOKING STATUS
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const tutorId = req.session?.user?.id;
    if (!tutorId || req.session?.user?.role !== "tutor") {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { status } = req.body;
    const validStatuses = ["Booked", "Completed", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.tutorId.toString() !== tutorId.toString()) {
      return res.status(403).json({ msg: "Not your booking" });
    }

    booking.status = status;
    await booking.save();

    if (booking) {
      await notificationService.createAndEmitNotification({
        recipientId: booking.userId,
        type: "BOOKING",
        title: `Booking ${status}`,
        message: `Your class with ${booking.tutorName} has been marked as ${status}.`,
        link: "/tutorials/profile/classHistory",
      });

      // Emit global refresh to the student
      import("../../sockets/index.js").then(({ getIo }) => {
        const io = getIo();
        if (io) io.to(booking.userId.toString()).emit("dashboard_refresh");
      });
    }

    res.json({ msg: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ msg: "Error updating status" });
  }
});

/**
 * ✅ CANCEL BOOKING (STUDENT)
 */
router.patch("/:id/cancel", async (req, res) => {
  try {
    const userId = resolveBookingStudentId(req);

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not your booking" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ msg: "Already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    await notificationService.createAndEmitNotification({
      recipientId: booking.tutorId,
      type: "BOOKING",
      title: "Class Cancelled",
      message: `A student has cancelled their class for ${booking.subject} on ${booking.date}.`,
      link: "/tutorials/tutor/dashboard",
    });

    import("../../sockets/index.js").then(({ getIo }) => {
      const io = getIo();
      if (io) io.to(booking.tutorId.toString()).emit("dashboard_refresh");
    });

    res.json({ msg: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ msg: "Error cancelling booking" });
  }
});

export default router;