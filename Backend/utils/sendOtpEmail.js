const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.MAIL_USERNAME;
const EMAIL_PASS = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendOtpToEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Anuvadini Login OTP",
      text: `${otp} is the OTP to login to your Anuvadini account and is valid for 10 minutes.\n\nOTP is confidential. DO NOT share this OTP with anyone.\n\nAnuvadini Team - AICTE.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email Sent:", info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = {
  sendOtpToEmail,
};
