import express from "express";
import { isAuthenticated, isStudent } from "../../middlewares/Tutorials/auth.js";

const router = express.Router();

// 👨‍🎓 Protected Student Profile Route
router.get("/", isAuthenticated, isStudent, (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user, // ← Passport stores user here
  });
});

export default router;