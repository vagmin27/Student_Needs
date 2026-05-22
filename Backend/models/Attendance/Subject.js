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

subjectSchema.index({ userId: 1, subjectName: 1 }, { unique: true });

export default mongoose.model("Subject", subjectSchema);
