import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
  },
  { timestamps: true }
);

// Unique per user + subject + date (NOT per date alone)
attendanceSchema.index(
  { userId: 1, subjectId: 1, date: 1 },
  { unique: true, name: "unique_user_subject_date" }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

/** Drop legacy indexes from old teacher/batch schema, then ensure correct compound unique */
export const syncAttendanceIndexes = async () => {
  const collection = Attendance.collection;
  const indexes = await collection.indexes();

  for (const idx of indexes) {
    const key = idx.key || {};
    const isLegacy =
      idx.name === "date_1_subject_1" ||
      (key.date && key.subject && !key.subjectId) ||
      (key.date && !key.subjectId && !key.userId && idx.unique);

    if (isLegacy && idx.name !== "_id_") {
      try {
        await collection.dropIndex(idx.name);
        console.log(`[Attendance] Dropped legacy index: ${idx.name}`);
      } catch (err) {
        if (err.code !== 27) console.warn(`[Attendance] dropIndex ${idx.name}:`, err.message);
      }
    }
  }

  await Attendance.syncIndexes();
};

export default Attendance;
