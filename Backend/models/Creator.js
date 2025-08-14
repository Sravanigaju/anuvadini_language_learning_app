const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phoneNumber: {
    type: Number,
    unique: true,
    sparse: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  educationQualification: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  expertise: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  linkedInProfile: {
  type: String,       // URL stored as text
  required: false,    // make it optional
 // match: /^https?:\/\/(www\.)?linkedin\.com\/.*$/, // (optional) Regex validation
},

  expertise: {
    type: String,
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  projectLinks: {
    type: String,
  },
  bio: {
    type: String,
    required:true,
  },




  // 👇 OTP & Verification
  otp: String,
  otpExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },

  // 👇 Creator Profile Fields
  educationQualification: String,
  yearsOfExperience: Number,
  expertise: String,
  portfolio: String,
  linkedinUrl: String,
  languages: [String],
  projectLinks: [String],
  bio: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model("Creator", creatorSchema, "creators");
