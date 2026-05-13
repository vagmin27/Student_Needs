import myDB from "../../db/Tutorials/myDB.js";
import Tutor from "../../models/Tutorials/Tutor.js";

export const searchAllTutors = async (req, res) => {
  try {
    console.log("🔥 QUERY PARAMS:", req.query);

    const page = Number(req.query.page) || 0;   // ✅ fix
    const keyword = req.query.query || "";      // ✅ fix

    console.log("🔥 KEYWORD:", keyword);
    console.log("🔥 PAGE:", page);

    // ✅ Search in users collection
    const [usersData, usersCount] = await myDB.findTutors(keyword, page);

    // ✅ Search in Tutor collection
    const tutorsData = await Tutor.find({
      expertise: { $regex: keyword, $options: "i" },
    })
      .select("-password")
      .skip(page * 18)
      .limit(18)
      .lean();

    const tutorsCount = await Tutor.countDocuments({
      expertise: { $regex: keyword, $options: "i" },
    });

    // ✅ Merge both arrays
    const data = [...usersData, ...tutorsData];
    const numbers = usersCount + tutorsCount;

    res.status(200).json({
      data,
      numbers: numbers || data.length, // ✅ fallback
    });


  } catch (err) {
    console.error("❌ SEARCH ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const getTutor = async (req, res) => {
  try {
    // ✅ Try Tutor model first
    let tutor = await Tutor.findById(req.params.tutorId).select("-password");

    // ✅ Fall back to users collection
    if (!tutor) {
      tutor = await myDB.getUsersById(req.params.tutorId);
    }

    // ✅ 404 if both null
    if (!tutor) {
      return res.status(404).json({ msg: "Tutor not found" });
    }

    res.status(200).json({ data: tutor });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const user = req.session?.passport?.user;

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await myDB.makeBooking(user, req.body);

    res.status(200).json({ msg: "Booking created" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getSchedule = async (req, res) => {
  try {
    // ✅ Student accessing tutor schedule via Passport session
    const userId = req.session?.passport?.user;

    console.log("SESSION USER ID:", userId);

    // ✅ prevent crash
    if (!userId) {
      return res.status(200).json({
        data: { schedule: [] },
      });
    }

    const result = await myDB.getUserSchedule(userId);

    res.status(200).json({
      data: {
        schedule: result?.schedule || [],
      },
    });

  } catch (err) {
    console.error("❌ GET SCHEDULE ERROR:", err);

    res.status(200).json({
      data: { schedule: [] },
    });
  }
};