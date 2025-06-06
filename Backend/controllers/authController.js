const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp"); // Add this utility
const { sendOtpToPhoneNumber } = require("../utils/sendOtpSms");
// Register a new user
exports.register = async (req, res) => {
  try {

    const { username, phoneNumber, password } = req.body;

    // Validate required fields
    if (!username || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate phone number format (basic validation)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    const newUser = new User({
      username,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false
    });

    await newUser.save();

    try {
      await sendOtpToPhoneNumber(phoneNumber, otp);
      res.status(201).json({
        message: "User registered successfully. OTP sent to your phone number.",
        success:"true",
        userid : newUser._id
      });
    } catch (smsError) {
      // If SMS sending fails, delete the user and return error
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({
        message: "Failed to send OTP. Please try again.",
        error: smsError.message
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if email is verified before allowing login
    if (!user.isVerified) {
      return res.status(403).json({ message: "Phone number not verified. Please verify your Phone number first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ success: true, message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ success : false, message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtpToPhoneNumber(phoneNumber, otp);
    res.status(200).json({ message: "OTP sent via SMS" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user || !user.otp || !user.otpExpiry)
      return res.status(400).json({ message: "OTP not found. Request again." });
    if (user.otp !== otp.toString().trim())
      return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // user.otp = undefined;
    // user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save();
    const userId = user._id;
    res.status(200).json({success: true,
      message: "Phone verified successfully",
      userId: userId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};