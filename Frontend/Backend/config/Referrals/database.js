import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGO_URI;

export const dbconnect = async () => {
    try {
        if (!MONGODB_URL) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ DB Connection Success`);
        return true;

    } catch (err) {

        console.error(`❌ DB Connection Failed`);
        console.error("Error Details:", err.message);

        if (err.message.includes("authentication failed")) {
            console.error("🔑 Check MongoDB username/password");
        }
        else if (
            err.message.includes("IP") ||
            err.message.includes("whitelist")
        ) {
            console.error("🌐 Check MongoDB Atlas IP whitelist");
        }
        else if (
            err.message.includes("ENOTFOUND") ||
            err.message.includes("network")
        ) {
            console.error("🌍 Check internet/cluster URL");
        }

        throw err;
    }
};