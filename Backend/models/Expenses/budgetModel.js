import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const budgetModel = mongoose.model("budgets", budgetSchema);

export default budgetModel;