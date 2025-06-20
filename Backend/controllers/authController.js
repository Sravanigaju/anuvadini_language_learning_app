const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp");
const { sendOtpToPhoneNumber } = require("../utils/sendOtpSms");
const { sendOtpToEmail } = require("../utils/sendOtpEmail");
const UserProfile = require("../models/UserProfile");

exports.register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    // Validate required fields
    if (!username || !phoneNumber || (!password && !email)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate phone number format (basic validation)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({
      $or: [
        phoneNumber ? { phoneNumber } : null,
        email ? { email } : null
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with phone/email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = "123456";
    // const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    const newUser = new User({
      username,
      phoneNumber,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false
    });

    await newUser.save();
    console.log('New user created:', newUser);

    try {
      //await sendOtpToPhoneNumber(phoneNumber, otp);
      res.status(201).json({
        message: "User registered successfully. OTP sent to your phone number.",
        success: "true",
        userid: newUser._id,
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

exports.registeremail = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    // Validate required fields
    if (!username || !phoneNumber || (!password && !email)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate phone number format (basic validation)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({
      $or: [
        phoneNumber ? { phoneNumber } : null,
        email ? { email } : null
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with phone/email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = "123456";
    // const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    const newUser = new User({
      username,
      phoneNumber,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false
    });

    await newUser.save();

    try {
      await sendOtpToEmail(email, otp);
      res.status(201).json({
        message: "User registered successfully. OTP sent to your email.",
        success: "true",
        userid: newUser._id,
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

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    // const otp = generateOtp();
    const otp = "123456";
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

exports.sendOtpEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtpToEmail(email, otp);
    res.status(200).json({ message: "OTP sent via Email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phoneNumber, email, otp } = req.body;

  try {
    const user = await User.findOne(phoneNumber ? { phoneNumber } : { email });

    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "OTP not found. Please request again." });
    }

    if (user.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: `${phoneNumber ? "Phone" : "Email"} verified successfully`,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, email, password } = req.body;

    const user = await User.findOne(phoneNumber ? { phoneNumber } : { email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(403).json({
        message: `${phoneNumber ? "Phone" : "Email"} not verified. Please verify first.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const userProfile = await UserProfile.findOne({ userId: user._id });
    if (!userProfile) return res.status(404).json({ message: "User profile not found" });

    const token = generateToken(user.phoneNumber, user._id);

    const targetLang = userProfile.interestedLanguages[0]?.languageName;
    const langProgress = userProfile.interestedLanguages[0];

    const progress = {
      level: langProgress.level || 0,
      cat_count: langProgress.catagoriecount || 0,
      less_count: langProgress.completedLessons || 0,
      less_ass_count: langProgress.assesmentcompleted || 0,
      fin_ass_count: langProgress.finalassesementcompleted || 0,
      score: langProgress.xp || 0,
      streak: langProgress.streak?.currentStreak || 0,
      progress_lang: langProgress.progressPercent || 0
    };

    const username = `${userProfile.firstName} ${userProfile.lastName}`;

    res.status(200).json({
      success: true,
      token:token,
      message: "Login successful",
      userId: user._id,
      username: username,
      sourceLanguage: userProfile.sourceLanguage,
      targetLanguage: targetLang,
      progress: progress
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
