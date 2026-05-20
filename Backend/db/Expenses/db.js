import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected!!!");
    console.log("DB:", conn.connection.name);
    console.log("HOST:", conn.connection.host);
  } catch (error) {
    console.log("Mongo Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;