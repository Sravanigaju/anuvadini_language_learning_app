const Institution = require("../models/Institution");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp");
const { sendOtpToPhoneNumber } = require("../utils/sendOtpSms");
const { sendOtpToEmail } = require("../utils/sendOtpEmail");

// 1️ Register
exports.registerInstitution = async (req, res) => {
  try {
    const {
      institutionName, contactInfo, email, password, confirmPassword,
      address, location, website, description
    } = req.body;

    if (!institutionName || !contactInfo || !password || !confirmPassword) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const exists = await Institution.findOne({ $or: [{ contactInfo }, { email }] });
    if (exists) {
      return res.status(409).json({ message: "Institution already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newInstitution = new Institution({
      institutionName,
      contactInfo,
      email,
      password: hashedPassword,
      address,
      location,
      website,
      description,
    });

    await newInstitution.save();

    res.status(201).json({
      message: "Institution registered. Please send OTP for verification.",
      institutionId: newInstitution._id
    });

  } catch (err) {
    console.error("registerInstitution error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2️ Send OTP (Phone)
exports.sendInstitutionOtpPhone = async (req, res) => {
  const { contactInfo } = req.body;
  try {
    const inst = await Institution.findOne({ contactInfo });
    if (!inst) return res.status(404).json({ message: "Institution not found" });

    const otp = generateOtp();
    inst.otp = otp;
    inst.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await inst.save();

    await sendOtpToPhoneNumber(contactInfo, otp);
    res.status(200).json({ message: "OTP sent via SMS" });

  } catch (err) {
    console.error("sendInstitutionOtpPhone error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 3️ Send OTP (Email)
exports.sendInstitutionOtpEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const inst = await Institution.findOne({ email });
    if (!inst) return res.status(404).json({ message: "Institution not found" });

    const otp = generateOtp();
    inst.otp = otp;
    inst.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await inst.save();

    await sendOtpToEmail(email, otp);
    res.status(200).json({ message: "OTP sent via Email" });

  } catch (err) {
    console.error("sendInstitutionOtpEmail error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 4️ Verify OTP
exports.verifyInstitutionOtp = async (req, res) => {
  const { contactInfo, email, otp } = req.body;
  try {
    const inst = await Institution.findOne(contactInfo ? { contactInfo } : { email });
    if (!inst || !inst.otp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (inst.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (inst.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    inst.isVerified = true;
    inst.otp = inst.otpExpiry = null;
    await inst.save();

    res.status(200).json({
      message: "Institution verified successfully",
      institutionId: inst._id
    });

  } catch (err) {
    console.error("verifyInstitutionOtp error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 5️ Login
exports.loginInstitution = async (req, res) => {
  const { contactInfo, email, password } = req.body;
  try {
    const inst = await Institution.findOne(contactInfo ? { contactInfo } : { email });
    if (!inst) return res.status(404).json({ message: "Institution not found" });

    if (!inst.isVerified) {
      return res.status(403).json({ message: "Phone/Email not verified" });
    }

    const match = await bcrypt.compare(password, inst.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      institutionId: inst._id,
      institutionName: inst.institutionName,
      email: inst.email,
      contactInfo: inst.contactInfo
    });

  } catch (err) {
    console.error("loginInstitution error:", err);
    res.status(500).json({ message: err.message });
  }
};
