import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      unique: true,
    },

    subjectCode: {
      type: String,
    },

    department: {
      type: String,
    },

    year: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Subject",
  subjectSchema
);