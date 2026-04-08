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
        default: "Alumni",

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
}, { timestamps: true }
)   

export default mongoose.model("Alumni", AlumniSchema);