import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    savedAmount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true },
);

const goalModel = mongoose.model("goals", goalSchema);

export default goalModel;