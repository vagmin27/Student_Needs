import User from "../../models/Tutorials/user.js";

export const uploadProfilePic = async (req, res) => {
  try {
    console.log("🔥 Upload API HIT");
    console.log("FILE:", req.file);

    // ❌ No file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // ✅ Get user from session
    const userId = req.session?.passport?.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ Save filename in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { pic: req.file.filename },
      { new: true }
    );

    console.log("✅ Saved in DB:", updatedUser.pic);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      pic: updatedUser.pic,
    });

  } catch (error) {
    console.error("❌ Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};