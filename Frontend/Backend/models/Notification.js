import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true, // Crucial for querying user feeds
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // Null implies SYSTEM
    },
    type: {
      type: String,
      enum: ["SYSTEM", "REFERRAL", "BOOKING", "EXPENSE", "ANNOUNCEMENT"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: "", // Where clicking the notification takes the user
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true, // Crucial for unread counts
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimizing unread queries for a specific user
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
