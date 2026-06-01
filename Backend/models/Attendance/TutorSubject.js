import mongoose from "mongoose";

const tutorSubjectSchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
  },
  { timestamps: true }
);

tutorSubjectSchema.index({ tutorId: 1, subjectName: 1 }, { unique: true });

export default mongoose.model(
  "TutorSubject",
  tutorSubjectSchema,
  "tutor_subjects"
);
