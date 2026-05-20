import Tutor from "../../models/Tutorials/Tutor.js";
import bcrypt from "bcrypt";

export const tutorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const tutor = await Tutor.findOne({ email });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const isMatch = await bcrypt.compare(password, tutor.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ FIX: unified session structure
    req.session.user = {
      id: tutor._id,
      role: "tutor",
      email: tutor.email,
    };

    console.log("✅ SESSION SAVED:", req.session.user);

    res.status(200).json({
      status: "ok", // 🔥 IMPORTANT (frontend expects this)
      message: "Tutor login successful",
      tutor,
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};