const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp"); // Add this utility
const { sendOtpToPhoneNumber } = require("../utils/sendOtpSms");
const UserProfile = require("../models/UserProfile");

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
    console.log('Login request body:', req.body);
    const { phoneNumber, password } = req.body;

    // 1. Find user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Phone number not verified. Please verify your phone number first."
      });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Fetch associated user profile
    const userProfile = await UserProfile.findOne({ userId: user._id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // 5. Send success response with language data
    res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id,
      sourceLanguage: userProfile.sourceLanguage || null,
      targetLanguages: userProfile.interestedLanguages || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getLoginByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Find the user profile
    const userProfile = await UserProfile.findOne({ userId: user._id });
    if (!userProfile) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    // 3. Return source and target language info
    res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id,
      sourceLanguage: userProfile.sourceLanguage || null,
      targetLanguages: userProfile.interestedLanguages || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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