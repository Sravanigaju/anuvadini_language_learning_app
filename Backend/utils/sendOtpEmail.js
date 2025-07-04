const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure .env is loaded

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: "apikey", // This must literally be "apikey"
    pass: process.env.SENDGRID_API_KEY, // Load from .env
  },
});

const sendOtpToEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: "natssupport@aicte-india.org", // Use a verified sender from SendGrid
      to: email,
      subject: "Anuvadini Login OTP",
      text: `${otp} is the OTP to login to your Anuvadini account and is valid for 10 minutes.\n\nOTP is confidential. DO NOT share this OTP with anyone.\n\nAnuvadini Team - AICTE.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email Sent:", info.response);
    return info.response;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
};

module.exports = {
  sendOtpToEmail,
};
