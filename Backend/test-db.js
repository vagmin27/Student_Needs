import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-platform");

import TutorialConversation from './models/Tutorials/TutorialConversation.js';
import Booking from './models/Tutorials/Booking.js';

async function run() {
  const convs = await TutorialConversation.find().lean();
  console.log("Conversations:", convs.length);
  if (convs.length > 0) {
    console.log("Sample Conv:", JSON.stringify(convs[0], null, 2));
  }

  const bookings = await Booking.find().lean();
  console.log("Bookings:", bookings.length);
  if (bookings.length > 0) {
    console.log("Sample Booking:", JSON.stringify(bookings[bookings.length - 1], null, 2));
  }
  process.exit(0);
}

run().catch(console.error);
