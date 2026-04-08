import express from "express";
const router = express.Router();

// Import controllers
import { signup, login, getAlumniData } from "../controllers/AlumniAuth.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Alumni Authentication routes
// ********************************************************************************************************

// Route for alumni signup
router.post("/signup", signup);

// Route for alumni login
router.post("/login", login);

export default router;