const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true, // 👈 allows phoneNumber to be optional
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // 👈 allows email to be optional
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  changePasswordisVerified: {
    type: Boolean,
    default: false,
  },
  newPassword: {
    type: String,
  },
  changeotp: {
    type: String,
  },
  changeotpExpiry: {
    type: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model("User", userSchema, "users");
