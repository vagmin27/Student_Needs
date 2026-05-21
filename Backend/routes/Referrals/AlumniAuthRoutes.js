import express from "express";
const router = express.Router();

// Import controllers
import { signup, login, getAlumniData } from "../../controllers/Referrals/AlumniAuth.js";

// Import middleware
import { auth } from "../../middlewares/Referrals/auth.js";

// ********************************************************************************************************
//                                      Alumni Authentication routes
// ********************************************************************************************************

// Route for alumni signup
router.post("/signup", signup);

// Route for alumni login
router.post("/login", login);

// Route for fetching alumni data
router.get("/getAlumniData", auth, getAlumniData);

export default router;