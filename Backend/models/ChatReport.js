import mongoose from "mongoose";

const chatReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reporterModel",
    },
    reporterModel: {
      type: String,
      required: true,
      enum: ["ReferralStudent", "Tutor", "User"],
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reportedUserModel",
    },
    reportedUserModel: {
      type: String,
      required: true,
      enum: ["ReferralStudent", "Tutor", "User"],
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

chatReportSchema.index({ createdAt: -1 });

const ChatReport = mongoose.models.ChatReport || mongoose.model("ChatReport", chatReportSchema);
export default ChatReport;
