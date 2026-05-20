import myDB from "../../db/Tutorials/myDB.js";
import cloudinary from "../../utils/Tutorials/cloudinary.js";

export const delProfile = async (req, res) => {
  let id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ message: "User ID required" });
    }

    const user = await myDB.getUsersById(id);

    if (user?.pic) {
      const public_id = user.pic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(public_id);
    }

    await myDB.deleteUser(id);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};