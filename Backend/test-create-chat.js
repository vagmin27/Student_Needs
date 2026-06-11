import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-platform");

import TutorialConversation from './models/Tutorials/TutorialConversation.js';
import TutorialMessage from './models/Tutorials/TutorialMessage.js';
import Booking from './models/Tutorials/Booking.js';

async function run() {
  const booking = await Booking.findOne();
  if (!booking) {
    console.log("No booking found");
    process.exit(0);
  }

  console.log("Testing chat creation for booking:", booking._id);
  try {
    const conversation = await TutorialConversation.create({
      participants: [
        { userId: booking.userId, role: "student" },
        { userId: booking.tutorId, role: "tutor" }
      ],
      studentId: booking.userId,
      studentModel: "User",
      tutorId: booking.tutorId,
      bookingId: booking._id,
    });
    console.log("Conversation created successfully:", conversation._id);
  } catch (err) {
    console.error("auto chat creation failed", err);
  }
  process.exit(0);
}

run().catch(console.error);
