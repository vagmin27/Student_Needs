import mongoose from "mongoose";

const tutorialMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TutorialConversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "meeting_link", "system", "file"],
      default: "text",
    },
    text: {
      type: String,
      default: "",
    },
    attachments: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        mimeType: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    delivered: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
tutorialMessageSchema.index({ conversationId: 1, createdAt: -1 });

const TutorialMessage =
  mongoose.models.TutorialMessage ||
  mongoose.model("TutorialMessage", tutorialMessageSchema);

export default TutorialMessage;
