import express from "express";
import Booking from "../../models/Tutorials/Booking.js";
import User from "../../models/Tutorials/user.js";

const router = express.Router();

/**
 * ✅ CREATE BOOKING (FROM FRONTEND)
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.session?.passport?.user;

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

    console.log("✅ Booking Saved:", booking);

    if (tutorId) {
      await User.updateOne(
        {
          _id: tutorId,
          "schedule.date": date,
          "schedule.time": time,
        },
        {
          $inc: {
            "schedule.$.bookingCount": 1
          },
        },
      );
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
    const userId = req.session?.passport?.user;

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
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

    // Find ALL bookings for this tutor regardless of status
    const bookings = await Booking.find({
      tutorId: tutorId.toString(),
    });

    console.log("Tutor ID:", tutorId);
    console.log("Bookings found:", bookings.length);

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
    const { status } = req.body;
    const validStatuses = ["Booked", "Completed", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

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
    const userId = req.session?.passport?.user;

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Ensure the student owns this booking
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not your booking" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ msg: "Already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ msg: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ msg: "Error cancelling booking" });
  }
});

export default router;