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
    console.log("BODY", req.body);
    console.log("USER", req.user);

    const userId = resolveBookingStudentId(req);

    if (!userId) {
      return res.status(401).json({ msg: "Please log in to book a class" });
    }

    const { tutorId, tutorName, studentId, subject, date, time } = req.body;
    let slotId = req.body.slotId || req.body.selectedSlot?._id || req.body.selectedSlot?.id;

    // Do not fail if slotId is missing, just require date/time/subject/tutorId
    const requiredFields = { tutorId, subject, date, time };
    const missing = Object.keys(requiredFields).filter(key => !requiredFields[key]);

    if (missing.length > 0) {
      return res.status(400).json({ missing });
    }

    const finalUserId = studentId || userId;

    const existingBooking = await Booking.findOne({
      tutorId,
      userId: finalUserId,
      date,
      time,
      status: {
        $in: [
          "pending",
          "accepted",
          "upcoming",
          "in_progress",
          "Booked"
        ]
      }
    });

    if (existingBooking) {
      return res.status(409).json({
        msg: "You already booked this slot. Please select another available slot."
      });
    }

    let booking;

    try {
      booking = new Booking({
        userId: finalUserId,
        tutorId,
        tutorName: tutorName || "Tutor",
        subject,
        date,
        time,
        status: "pending",
      });

      await booking.save();
      console.log("booking saved");
    } catch (e) {
      console.error("booking save failed", e);
      throw e;
    }

    if (tutorId) {
      try {
        const matchQuery = { date, time };
        if (slotId) matchQuery._id = slotId;

        const result = await Tutor.updateOne(
          {
            _id: tutorId,
            schedule: {
              $elemMatch: matchQuery,
            },
          },
          {
            $inc: {
              "schedule.$.bookingCount": 1
            }
          }
        );

        console.log(result);

        if (result.modifiedCount === 0) {
          throw new Error("slot not found");
        }

        console.log("slot updated");
      } catch (e) {
        console.error("slot update failed", e);
        throw e;
      }

      try {
        await notificationService.createAndEmitNotification({
          recipientId: tutorId,
          type: "BOOKING",
          title: "New Class Booked",
          message: `A student has booked a class for ${subject} on ${date} at ${time}.`,
          link: "/tutorials/tutor/dashboard",
        });

        // Emit global refresh to the tutor so their dashboard instantly updates
        import("../../sockets/index.js").then(({ getIO, getIo }) => {
          try {
            const fn = getIO || getIo;
            const io = fn?.();

            if (io?.to) {
              io.to(tutorId.toString()).emit("dashboard_refresh");
            } else {
              console.warn("Socket unavailable");
            }
          } catch (e) {
            console.warn("Socket emit skipped", e.message);
          }
        }).catch(e => console.warn("Socket module import failed", e.message));
      } catch (e) {
        console.error("notification failed", e);
      }
    }

    res.status(201).json({ msg: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
      stack: err.stack
    });
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

    // Sync meeting link if empty
    for (let b of bookings) {
      if (!b.meetingLink && (b.status === "upcoming" || b.status === "in_progress")) {
        const tutor = await Tutor.findById(b.tutorId);
        if (tutor) {
          const slot = tutor.schedule.find(s => s.date === b.date && s.time === b.time);
          if (slot && slot.meetingLink) {
            b.meetingLink = slot.meetingLink;
            await b.save();
          }
        }
      }
    }

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
    const validStatuses = ["pending", "accepted", "upcoming", "in_progress", "completed", "declined", "Booked", "Completed", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.tutorId.toString() !== tutorId.toString() && booking.userId.toString() !== tutorId.toString()) {
      return res.status(403).json({ msg: "Not your booking" });
    }

    // Validation rules
    if (booking.status === "upcoming" && status === "completed") {
      return res.status(400).json({ msg: "Cannot complete booking directly from upcoming. Must join class first." });
    }
    if (booking.status === "upcoming" && status === "in_progress") {
      // Allowed: after Join Class
    }
    if (booking.status === "in_progress" && status === "completed") {
      // Allowed: after attendance marked OR tutor ends class
    }

    booking.status = status;

    // Sync meeting link when accepting
    if (status === "upcoming") {
      const tutor = await Tutor.findById(booking.tutorId);
      if (tutor) {
        const slot = tutor.schedule.find(s => s.date === booking.date && s.time === booking.time);
        if (slot && slot.meetingLink) {
          booking.meetingLink = slot.meetingLink;
        }
      }
    }

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
      import("../../sockets/index.js").then(({ getIO, getIo }) => {
        try {
          const fn = getIO || getIo;
          const io = fn?.();

          if (io?.to) {
            io.to(booking.userId.toString()).emit("dashboard_refresh");
          } else {
            console.warn("Socket unavailable");
          }
        } catch (e) {
          console.warn("Socket emit skipped", e.message);
        }
      }).catch(e => console.warn("Socket module import failed", e.message));
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

    import("../../sockets/index.js").then(({ getIO, getIo }) => {
      try {
        const fn = getIO || getIo;
        const io = fn?.();

        if (io?.to) {
          io.to(booking.tutorId.toString()).emit("dashboard_refresh");
        } else {
          console.warn("Socket unavailable");
        }
      } catch (e) {
        console.warn("Socket emit skipped", e.message);
      }
    }).catch(e => console.warn("Socket module import failed", e.message));

    res.json({ msg: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ msg: "Error cancelling booking" });
  }
});

export default router;