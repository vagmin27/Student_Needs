import mongoose from "mongoose";

const AlumniSchema = new mongoose.Schema({
    firstName: {
      minLength: 2,         
        maxLength: 20,
        type: String,
        required: true,
        trim: true, 
    },
    lastName: {
      minLength: 2, 
        maxLength: 20,
        type: String,
        required: true,
        trim: true, 

    },
    email: {
      type: String,     
        required: true,

        trim: true,
        unique: true,
    },  

    password: {
      type: String,
        required: true,

    },

    accountType: {

        type: String,
        default: "alumni",

        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: true,
    },
    company: {
        type: String,
        trim: true,
    },
    jobTitle: {
        type: String,
        trim: true,
    },
    yearsOfExperience: {
        type: Number,
        min: 0,
    },
    skills: [{
        type: String,
        trim: true,
    }],
    referralPreferences: {
        type: String,
        trim: true,
    },
    hiringInterests: {
        type: String,
        trim: true,
    },
    linkedinUrl: {
        type: String,
        trim: true,
    },
    githubUrl: {
        type: String,
        trim: true,
    },
    portfolioUrl: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    careerJourney: {
        type: String,
        trim: true,
    },
    profileCompleteness: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local",
    },
    providerId: {
        type: String,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null,
    },
}, { timestamps: true }
)   

export default mongoose.model("Alumni", AlumniSchema);