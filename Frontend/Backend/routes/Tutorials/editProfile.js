import express from "express";
import {
  updateProfile,
  uploadPic,
  delPic,
  retrieveProfileInfo,
} from "../../controllers/Tutorials/editProfile.js";

import upload from "../../utils/Tutorials/multer.js";
import { isAuthenticated } from "../../middlewares/Tutorials/auth.js";

const router = express.Router();

/**
 * ✅ GET profile (protected)
 */
router.get("/", isAuthenticated, retrieveProfileInfo);

/**
 * ✅ UPDATE profile (protected)
 */
router.post("/", isAuthenticated, updateProfile);

/**
 * ✅ UPLOAD profile picture (protected)
 */
router.post(
  "/upload",
  isAuthenticated,
  upload.single("profilePic"), // ⚠️ MUST match frontend
  uploadPic
);

/**
 * ✅ DELETE profile picture (protected)
 */
router.post("/delete-pic", isAuthenticated, delPic);

export default router;