import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    senderType: {
      type: String,
      enum: ["student", "alumni"],
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    file: {
      url: String, // Secure path /api/v1/chats/attachments/:fileName
      name: String, // Original filename
      type: String, // mime type (e.g. image/png)
      size: Number, // bytes
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    editHistory: [
      {
        text: String,
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ chat: 1, createdAt: 1 });

const ChatMessage = mongoose.models.ChatMessage || mongoose.model("ChatMessage", MessageSchema);
export default ChatMessage;
