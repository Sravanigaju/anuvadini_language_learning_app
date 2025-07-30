const Validator = require("../models/Validator");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp");
const { sendOtpToPhoneNumber } = require("../utils/sendOtpSms");
const { sendOtpToEmail } = require("../utils/sendOtpEmail");

exports.getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await Validator.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.registerValidator = async (req, res) => {
  try {
    const {
      username, email, phoneNumber, password, confirmPassword,
      yearsOfExperience, educationQualification,
      region, location, languages, bio, projectLinks,
      idProofUrl, certificateUrl
    } = req.body;
    console.log(req.body);

    if (!username || !phoneNumber || !password || !confirmPassword)
      return res.status(400).json({ message: "Required fields missing" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const exists = await Validator.findOne({ $or: [{ email }, { phoneNumber }] });
    if (exists) return res.status(409).json({ message: "Validator already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newValidator = new Validator({
      username, email, phoneNumber, password: hashed,
      yearsOfExperience, educationQualification,
      region, location, languages, bio, projectLinks,
      idProofUrl, certificateUrl,
      isVerified: false 
    });

    await newValidator.save();

    res.status(201).json({
      message: "Validator registered. Click 'Send OTP' to verify.",
      validatorId: newValidator._id
    });
  } catch (err) {
    console.error("registerValidator:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendValidatorOtpPhone = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const val = await Validator.findOne({ phoneNumber });
    if (!val) return res.status(404).json({ message: "Validator not found" });

    const otp = generateOtp();
    val.otp = otp;
    val.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await val.save();

    await sendOtpToPhoneNumber(phoneNumber, otp); 
    res.status(200).json({ message: "OTP sent via SMS" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


exports.sendValidatorOtpEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const val = await Validator.findOne({ email });
    if (!val) return res.status(404).json({ message: "Validator not found" });

    const otp = generateOtp();
    val.otp = otp;
    val.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await val.save();

    await sendOtpToEmail(email, otp); 
    res.status(200).json({ message: "OTP sent via Email" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


exports.verifyValidatorOtp = async (req, res) => {
  const { phoneNumber, email, otp } = req.body;
  try {
    const val = await Validator.findOne(phoneNumber ? { phoneNumber } : { email });
    if (!val || !val.otp) return res.status(400).json({ message: "OTP not found" });

    if (val.otp !== otp.trim())
      return res.status(400).json({ message: "Invalid OTP" });

    if (val.otpExpiry < new Date())
      return res.status(400).json({ message: "OTP expired" });

    val.isVerified = true;
    val.otp = val.otpExpiry = null;
    await val.save();

    res.status(200).json({
      message: "Validator verified successfully",
      validatorId: val._id
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


exports.loginValidator = async (req, res) => {
  const { phoneNumber, email, password } = req.body;

  try {
    // Validate all 3 fields are present
    if (!phoneNumber || !email || !password) {
      return res.status(400).json({ message: "Phone number, email, and password are required." });
    }

    // Find user with both phone number and email match
    const val = await Validator.findOne({ phoneNumber, email });

    if (!val) return res.status(404).json({ message: "Validator not found with provided credentials" });

    if (!val.isVerified) {
      return res.status(403).json({ message: "Phone or Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, val.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      validatorId: val._id,
      username: val.username,
      email: val.email
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
