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
  timezone: {
    type: String,
    default: 'Asia/Kolkata', // Default to IST
    validate: {
      validator: function(v) {
        return /^[A-Za-z]+\/[A-Za-z_]+$/.test(v);
      },
      message: props => `${props.value} is not a valid timezone!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model("User", userSchema, "users");
