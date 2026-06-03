import mongoose from "mongoose";

// Import the Mongoose library

const studentSchema = new mongoose.Schema({
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
    default: "student",
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  branch: {
    type: String,
    trim: true,
  },
  graduationYear: {
    type: Number,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  degree: {
    type: String,
    trim: true,
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: null,
  },
  bio: {
    type: String,
    trim: true,
  },
  careerInterests: [{
    type: String,
    trim: true,
  }],
  skills: [{
    type: String,
    trim: true,
  }],
  projects: [{
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
  }],
  certifications: [{
    name: {
      type: String,
      trim: true,
    },
    issuer: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
  }],
  preferredRoles: [{
    type: String,
    trim: true,
  }],
  resume: {
    data: {
      type: Buffer,
    },
    contentType: {
      type: String,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    uploadedAt: {
      type: Date,
    },
  },
  // linkedIn: {
  //   data: {
  //     type: Buffer,
  //   },
  //   linkedInUrl:{
  //     type: String,
  //   },
  //   contentType: {
  //     type: String,
  //   },
  //   fileName: {
  //     type: String,
  //   },
  //   fileSize: {
  //     type: Number,
  //   },
  //   uploadedAt: {
  //     type: Date,
  //   },
  // },
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
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  embeddingVector: {
    type: [Number], // For Cosine Similarity Matching
    select: false,
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
  refreshToken: {
    type: String,
    default: null,
  },
}, { timestamps: true }
)

const ReferralStudent =
  mongoose.models.ReferralStudent ||
  mongoose.model("ReferralStudent", studentSchema);

export default ReferralStudent;