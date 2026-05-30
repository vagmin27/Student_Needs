import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferralStudent",
      required: true,
      index: true,
    },
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
      index: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    unreadCountStudent: {
      type: Number,
      default: 0,
    },
    unreadCountAlumni: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate chat rooms
ChatSchema.index({ student: 1, alumni: 1 }, { unique: true });

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
export default Chat;
