import mongoose from "mongoose";
import { config } from "dotenv";
config();

import Opportunity from "./models/Referrals/OpportunityModel.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/student_needs");
  const opps = await Opportunity.find().lean();
  console.log(JSON.stringify(opps, null, 2));
  process.exit(0);
}
run();
