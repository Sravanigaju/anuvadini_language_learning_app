  const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true }, // random for Samvadini
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },

    // 👇 new fields
    samvadiniId: { type: String, unique: true, sparse: true },
    userType: { type: String, enum: ["LRN", "Samvadini"], default: "LRN" },

    createdAt: { type: Date, default: Date.now },
  }, { versionKey: false });

  module.exports = mongoose.model("User", userSchema, "users");