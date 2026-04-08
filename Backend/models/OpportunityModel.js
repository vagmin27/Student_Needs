import mongoose from "mongoose";

const OpportunitySchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true,
    },
    roleDescription: {
        type: String,
        required: true,
        trim: true,
    },
    requiredSkills: [{
        type: String,
        trim: true,
    }],
    experienceLevel: {
        type: String,
        required: true,
    },
    numberOfReferrals: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    referralsGiven: {
        type: Number,
        default: 0,
        min: 0,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumni",
        required: true,
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: true,
    },
    status: {
        type: String,
        enum: ["Open", "Closed"],
        default: "Open",
    },
}, { timestamps: true });

// Virtual field for isActive (computed from status)
OpportunitySchema.virtual('isActive').get(function() {
    return this.status === "Open";
});

// Ensure virtuals are included in JSON and Object outputs
OpportunitySchema.set('toJSON', { virtuals: true });
OpportunitySchema.set('toObject', { virtuals: true });

export default mongoose.model("Opportunity", OpportunitySchema);