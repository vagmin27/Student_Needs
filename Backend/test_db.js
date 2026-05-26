import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const students = await mongoose.connection.db.collection('referralstudents').find({}).toArray();
    console.log("Students college types:");
    students.forEach(s => console.log(s.email, "=> college:", typeof s.college, s.college));
    process.exit(0);
})
.catch(console.error);
