const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true }, // allows multiple nulls
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },       // optional for phone/email verification
  otpExpiry: { type: Date }    // optional expiry for OTP
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
