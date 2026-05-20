import myDB from "../../db/Tutorials/myDB.js";

export const deleteClass = async (req, res) => {
  try {
    const scheduleObj = req.body;

    await myDB.deleteBooking(scheduleObj);

    res.status(200).json({ msg: "Class removed" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};