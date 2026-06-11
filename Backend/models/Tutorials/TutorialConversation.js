import mongoose from "mongoose";

const tutorialConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        role: {
          type: String,
          enum: ["student", "tutor"],
          required: true,
        },
      },
    ],
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "studentModel",
    },
    studentModel: {
      type: String,
      required: true,
      enum: ["User", "ReferralStudent"],
      default: "User",
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tutor",
    },
    latestBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    latestSubject: {
      type: String,
      default: "",
    },
    activeBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      }
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TutorialMessage",
      default: null,
    },
    latestAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      student: {
        type: Number,
        default: 0,
      },
      tutor: {
        type: Number,
        default: 0,
      },
    },
    archived: {
      student: {
        type: Boolean,
        default: false,
      },
      tutor: {
        type: Boolean,
        default: false,
      },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
tutorialConversationSchema.index({ studentId: 1, tutorId: 1 });
tutorialConversationSchema.index({ activeBookings: 1 });
tutorialConversationSchema.index({ latestBookingId: 1 });
tutorialConversationSchema.index({ latestAt: -1 });

const TutorialConversation =
  mongoose.models.TutorialConversation ||
  mongoose.model("TutorialConversation", tutorialConversationSchema);

export default TutorialConversation;
