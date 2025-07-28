const Creator = require("../models/Creator");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp");
const { sendOtpToPhoneNumber } = require("../utils/sendOtpSms");
const { sendOtpToEmail } = require("../utils/sendOtpEmail");

// Creator Registration
exports.registerCreator = async (req, res) => {
  try {
    const {
      username, email, phoneNumber, password,                                 
      educationQualification, yearsOfExperience,
      expertise, portfolio, linkedinUrl,
      languages, projectLinks, bio
    } = req.body;

    if (!username || !phoneNumber || !password) {
      return res.status(400).json({ message: "All feilds are Required" });
    }

    const existing = await Creator.findOne({
      $or: [
        { email },
        { phoneNumber }
      ]
    });


    if (existing) return res.status(400).json({ message: "Creator already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const newCreator = new Creator({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
      educationQualification,
      yearsOfExperience,
      expertise,
      portfolio,
      linkedinUrl,
      languages,
      projectLinks,
      bio
    });

    await newCreator.save();

    await sendOtpToEmail(email, otp); 

    res.status(201).json({
      message: "Creator registered. OTP sent.",
      creatorId: newCreator._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//  Send OTP to phone number
exports.sendOtpToCreatorPhone = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const creator = await Creator.findOne({ phoneNumber });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const otp = generateOtp();
    
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    creator.otp = otp;
    creator.otpExpiry = otpExpiry;
    await creator.save();

    await sendOtpToPhoneNumber(phoneNumber, otp);
    res.status(200).json({ message: "OTP sent to phone successfully" });
  } catch (error) {
    console.error("Send phone OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP to phone" });
  }
};


//  Send OTP to email
exports.sendOtpToCreatorEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const creator = await Creator.findOne({ email });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
     console.log (otp)

    creator.otp = otp;
    creator.otpExpiry = otpExpiry;
    await creator.save();

    await sendOtpToEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("Send email OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP to email" });
  }
};

// Verify Creator OTP
exports.verifyCreatorOtp = async (req, res) => {
  const { phoneNumber, email, otp } = req.body;

  try {
    const creator = await Creator.findOne(phoneNumber ? { phoneNumber } : { email });

    if (!creator || !creator.otp || !creator.otpExpiry)
      return res.status(400).json({ message: "OTP not found" });

    if (creator.otp !== otp.toString().trim())
      return res.status(400).json({ message: "Invalid OTP" });

    if (creator.otpExpiry < new Date())
      return res.status(400).json({ message: "OTP expired" });

    creator.isVerified = true;
    creator.otp = null;
    creator.otpExpiry = null;
    await creator.save();

    res.status(200).json({
      message: "OTP verified successfully",
      creatorId: creator._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Creator Login
exports.loginCreator = async (req, res) => {
  const { phoneNumber, email, password } = req.body;

  try {
    //  require all three fields
    if (!phoneNumber || !email || !password) {
      return res.status(400).json({
        message: "Phone number, email, and password are required."
      });
    }

    //  find creator who matches BOTH phoneNumber and email
    const creator = await Creator.findOne({ phoneNumber, email });
    if (!creator) {
      return res.status(404).json({
        message: "Creator not found with provided phone/email."
      });
    }
    //  ensure OTP‑verified
    if (!creator.isVerified) {
      return res.status(403).json({
        message: "Phone or Email not verified. Please verify first."
      });
    }

    //  check password
    const match = await bcrypt.compare(password, creator.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //  success
    res.status(200).json({
      message: "Login successful",
      creatorId: creator._id,
      username: creator.username,
      email: creator.email
    });
  } catch (err) {
    console.error("loginCreator:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};