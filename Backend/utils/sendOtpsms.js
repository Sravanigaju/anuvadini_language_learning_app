const nodemailer = require("nodemailer");

async function sendOtpEmail(toEmail, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS, // your email
      pass: process.env.EMAIL_PASSWORD, // app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: toEmail,
    subject: "OTP Verification - Anuvadini",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendOtpEmail;
