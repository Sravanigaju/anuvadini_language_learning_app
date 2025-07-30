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
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
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
