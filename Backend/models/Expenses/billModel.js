import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    billName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringType: {
      type: String,
      enum: ["None", "Monthly", "Quarterly", "Semester", "Yearly"],
      default: "None",
    },
    status: {
      type: String,
      enum: ["Upcoming", "Due Today", "Overdue", "Paid"],
      default: "Upcoming",
      index: true,
    },
    sent2DayReminder: {
      type: Boolean,
      default: false,
    },
    sent1DayReminder: {
      type: Boolean,
      default: false,
    },
    sentDueDayReminder: {
      type: Boolean,
      default: false,
    },
    paidDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for compound sorting (e.g., status, priority, dueDate)
billSchema.index({ userId: 1, status: 1, priority: 1, dueDate: 1 });

const billModel = mongoose.model("bills", billSchema);
export default billModel;
