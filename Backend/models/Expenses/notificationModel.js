import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    reminderEnabled: {
      type: Boolean,
      default: true,
    },
    reminderType: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    reminderTime: {
      type: String,
      default: "21:00",
    },
    monthlyReportEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const notificationModel = mongoose.model(
  "notificationSettings",
  notificationSchema,
);

export default notificationModel;