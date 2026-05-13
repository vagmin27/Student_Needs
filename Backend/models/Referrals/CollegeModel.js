import mongoose from "mongoose";
import { type } from "os";

const collegeSchema = new mongoose.Schema({
    name: {
      minLength: 2,
        maxLength: 100,
        type: String,
        required: true,     
        trim: true,
    },
    matchingName: {
        type: String,
        unique: true,
        required: true,     
        trim: true,
    },
    Student : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }],

    Alumni : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumni",
    }],
}, { timestamps: true }
)   

export default mongoose.model("College", collegeSchema);