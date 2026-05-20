import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    term: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
    },
    gradePoint: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

// Compound index to quickly fetch a student's grades ordered by semester
gradeSchema.index({ userId: 1, semester: 1 });

const GradeModel = mongoose.model("grades", gradeSchema);

export default GradeModel;
