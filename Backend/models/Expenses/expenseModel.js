import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      default: "expense",
    },
    category: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Bank"],
      default: "UPI",
    },
    note: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: null,
    },
    nextRecurringDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const expenseModel = mongoose.model("expenses", expenseSchema);

export default expenseModel;