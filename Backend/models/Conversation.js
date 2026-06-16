import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // Unique conversation key to guarantee only one chat per student-tutor pair
    // Format: "studentId_tutorId"
    conversationKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Array of participant IDs for fast queries
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    // Dynamic Student Reference
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "studentModel",
    },
    studentModel: {
      type: String,
      required: true,
      enum: ["ReferralStudent", "User"],
      default: "ReferralStudent",
    },
    // Dynamic Tutor Reference
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "tutorModel",
    },
    tutorModel: {
      type: String,
      required: true,
      enum: ["Tutor", "User"],
      default: "Tutor",
    },
    // Last Message references
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    // Unread counters
    unreadCounts: {
      student: {
        type: Number,
        default: 0,
      },
      tutor: {
        type: Number,
        default: 0,
      },
    },
    // Archiving status
    isArchivedByStudent: {
      type: Boolean,
      default: false,
    },
    isArchivedByTutor: {
      type: Boolean,
      default: false,
    },
    // Blocking status
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    blockedModel: {
      type: String,
      enum: ["ReferralStudent", "Tutor", "User", null],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });
conversationSchema.index({ studentId: 1, isArchivedByStudent: 1 });
conversationSchema.index({ tutorId: 1, isArchivedByTutor: 1 });

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export default Conversation;
