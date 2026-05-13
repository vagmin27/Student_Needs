import express from "express";
const router = express.Router();

// Import controllers
import { signup, login, getStudentData } from "../controllers/StudentAuth.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

export default router;