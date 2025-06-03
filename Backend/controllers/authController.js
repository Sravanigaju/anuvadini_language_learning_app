const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp"); // Add this utility
const sendOtpSms = require("../utils/sendOtpSms"); // Add this utility

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, phoneNumber, password } = req.body;

    const existingUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, phoneNumber, password: hashedPassword, isEmailVerified: false });
    await newUser.save();

    // Optionally: send OTP immediately after registration
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    newUser.otp = otp;
    newUser.otpExpiry = otpExpiry;
    await newUser.save();
    // await sendOtpSms(phoneNumber, otp);
    // await sendOtpEmail(phoneNumber, otp);

    res.status(201).json({ message: "User registered successfully. OTP sent to sms." });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    await sendOtpSms(phoneNumber, otp);
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

    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Phone verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};