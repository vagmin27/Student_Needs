import mongoose from "mongoose";

const recurringRuleSchema = new mongoose.Schema(
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
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: "Monthly",
    },
    category: {
      type: String,
      default: "Other",
    },
    nextDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index to optimize queries from the daily cron job and user retrieval
recurringRuleSchema.index({ userId: 1, nextDate: 1, isActive: 1, isDeleted: 1 });

const recurringRuleModel = mongoose.model("recurringRules", recurringRuleSchema);
export default recurringRuleModel;
