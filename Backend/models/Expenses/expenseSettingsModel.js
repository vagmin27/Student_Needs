import mongoose from "mongoose";

const expenseSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
      index: true,
    },
    monthlyBudget: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    weeklyBudget: {
      type: Number,
      min: 0,
      default: 0,
    },
    dailyBudget: {
      type: Number,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP"],
      default: "INR",
    },
    savingsGoal: {
      type: Number,
      min: 0,
      default: 0,
    },
    categoryLimits: {
      type: Map,
      of: Number,
      default: {},
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
      billDueAlerts: { type: Boolean, default: true },
      overdueAlerts: { type: Boolean, default: true },
      savingsGoalAlerts: { type: Boolean, default: true },
    },
    alertThresholds: {
      fifty: { type: Boolean, default: true },
      seventyFive: { type: Boolean, default: true },
      ninety: { type: Boolean, default: true },
      hundred: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const expenseSettingsModel = mongoose.model("expenseSettings", expenseSettingsSchema);
export default expenseSettingsModel;
