import express from "express";
import upload from "../../utils/Tutorials/multer.js";
import { uploadProfilePic } from "../../controllers/Tutorials/uploadController.js";
import { isAuthenticated } from "../../middlewares/Tutorials/auth.js";

const router = express.Router();

// 🔥 ONLY IMAGE UPLOAD ROUTE
router.post(
  "/profile-pic",
  isAuthenticated,
  upload.single("profilePic"),
  uploadProfilePic
);

export default router;