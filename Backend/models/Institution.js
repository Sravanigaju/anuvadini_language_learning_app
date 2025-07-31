const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
  institutionName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },

  // OTP & Verification
  otp: String,
  otpExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },

  // Extra fields
  address: String,
  location: String,
  website: String,
  description: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model("Institution", institutionSchema);
