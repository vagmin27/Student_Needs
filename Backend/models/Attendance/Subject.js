import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

subjectSchema.index(
  { userId: 1, subjectName: 1 },
  { unique: true, name: "unique_user_subject_name" }
);

const Subject = mongoose.model("Subject", subjectSchema);

/** Drop legacy global subjectName unique index, then ensure compound unique */
export const syncSubjectIndexes = async () => {
  const collection = Subject.collection;
  const indexes = await collection.indexes();

  for (const idx of indexes) {
    const key = idx.key || {};
    const isLegacy =
      idx.name === "subjectName_1" ||
      (key.subjectName && !key.userId && idx.unique);

    if (isLegacy && idx.name !== "_id_") {
      try {
        await collection.dropIndex(idx.name);
        console.log(`[Subject] Dropped legacy index: ${idx.name}`);
      } catch (err) {
        if (err.code !== 27) {
          console.warn(`[Subject] dropIndex ${idx.name}:`, err.message);
        }
      }
    }
  }

  await Subject.syncIndexes();
};

export default Subject;
