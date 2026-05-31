import mongoose from "mongoose";
import { config } from "dotenv";
config();

import Application from "./models/Referrals/ApplicationModel.js";
import Student from "./models/Referrals/StudentModel.js";
import Chat from "./models/Referrals/ChatModel.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  const students = await Student.find({}, "firstName lastName email profileCompleteness").lean();
  console.log("\n--- STUDENTS ---");
  console.log(students);

  const applications = await Application.find().lean();
  console.log("\n--- APPLICATIONS ---");
  console.log(applications.map(app => ({
    _id: app._id,
    student: app.student,
    alumni: app.alumni,
    status: app.status,
    archived: app.archived,
    archiveAt: app.archiveAt
  })));

  const chats = await Chat.find().lean();
  console.log("\n--- CHATS ---");
  console.log(chats);

  process.exit(0);
}
run().catch(console.error);
