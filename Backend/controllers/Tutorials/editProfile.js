import myDB from "../../db/Tutorials/myDB.js";
import cloudinary from "../../utils/Tutorials/cloudinary.js";
import User from "../../models/Tutorials/user.js";
import fs from "fs";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.session?.passport?.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profileInfo = req.body;

    await myDB.updatesProfile(userId, profileInfo);

    res.status(200).json({
      profile: profileInfo,
      message: "Profile updated",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/editProfile.js

export const uploadPic = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // ✅ FIX: get user from session
    const userId = req.session?.passport?.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // ✅ UPDATE DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { pic: req.file.filename },
      { new: true }
    );

    console.log("✅ Updated User Pic:", updatedUser.pic);

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded",
      pic: updatedUser.pic,
    });

  } catch (error) {
    console.error("🔥 Upload Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const delPic = async (req, res) => {
  try {
    const id = req.session?.passport?.user;

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await myDB.getUsersById(id);

    if (!user?.pic) return res.status(400).json({ message: "No pic" });

    const public_id = user.pic.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(public_id);

    await myDB.updatesPic(id, null); // ✅ clear from DB

    res.status(200).json({ message: "Profile pic deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const retrieveProfileInfo = async (req, res) => {
  try {
    const userId = req.session?.passport?.user;

    if (!userId) {
      return res.status(401).json({ message: "Login required" });
    }

    const profileInfo = await myDB.getUsersById(userId);

    res.status(200).json({
      profile: profileInfo.profile,
      pic: profileInfo.pic,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};