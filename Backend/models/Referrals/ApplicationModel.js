import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    studentDetails: {
        profileScore: {
            type: Number,
            default: null,
        },
        interviewScore: {
            type: Number,
            default: null,
        },
    },
    alumni: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumni",
        required: true,
    },
    status: {
        type: String,
        enum: ["Applied", "Shortlisted", "Referred", "Rejected"],
        default: "Applied",
    },
    // Snapshot of student's resume at the time of application
    resumeSnapshot: {
        fileName: String,
        fileSize: Number,
        contentType: String,
        uploadedAt: Date,
    },
    // Snapshot of key student profile info at application time
    profileSnapshot: {
        firstName: String,
        lastName: String,
        email: String,
        branch: String,
        graduationYear: Number,
        skills: [String],
        profileCompleteness: Number,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    shortlistedAt: {
        type: Date,
    },
    referredAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ["Applied", "Shortlisted", "Referred", "Rejected"],
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        note: String,
    }],
}, { timestamps: true });

// Compound index to prevent duplicate applications
ApplicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

export default mongoose.model("Application", ApplicationSchema);