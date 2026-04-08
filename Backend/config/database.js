const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.DB_URL;

exports.dbconnect = async () => {
	try {
		if (!MONGODB_URL) {
			throw new Error("DB_URL is not defined in environment variables");
		}

		await mongoose.connect(MONGODB_URL, {
			serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
			socketTimeoutMS: 45000,
		});
		
		console.log(`✅ DB Connection Success`);
		return true;
	} catch (err) {
		console.error(`❌ DB Connection Failed`);
		console.error("Error Details:", err.message);
		
		// Provide helpful error messages
		if (err.message.includes("authentication failed")) {
			console.error("🔑 Check your MongoDB username and password in .env file");
		} else if (err.message.includes("IP") || err.message.includes("whitelist")) {
			console.error("🌐 Check if your IP is whitelisted in MongoDB Atlas");
		} else if (err.message.includes("ENOTFOUND") || err.message.includes("network")) {
			console.error("🌍 Check your internet connection and MongoDB cluster URL");
		}
		
		throw err; // Re-throw to handle in InitlizeConnection
	}
};