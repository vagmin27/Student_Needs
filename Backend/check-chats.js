import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-platform");

import User from './models/Tutorials/user.js';
import AttUser from './models/Attendance/User.js';
import ReferralStudent from './models/Referrals/StudentModel.js';

async function check() {
  const ids = ["6a0741bc53826da3473090c1", "6a28ffb574dc2ff58a23c4d2"];
  
  for (const id of ids) {
    const u1 = await User.findById(id).lean();
    const u2 = await AttUser.findById(id).lean();
    const u3 = await ReferralStudent.findById(id).lean();
    console.log(`ID: ${id}`);
    console.log(`User: ${u1 ? JSON.stringify(u1) : 'null'}`);
    console.log(`AttUser: ${u2 ? JSON.stringify(u2) : 'null'}`);
    console.log(`RefStudent: ${u3 ? JSON.stringify(u3) : 'null'}`);
    console.log('---');
  }
  process.exit(0);
}
check();
