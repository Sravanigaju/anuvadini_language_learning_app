const axios = require("axios");
const URL = process.env.URL;
const OTP_JSESSIONID = process.env.OTP_JSESSIONID;


const sendOtpToPhoneNumber = async (phoneNumber, otp) => {
  console.log(`OTP for ${phoneNumber}: ${otp}`);
  await sendmobileOtp(otp, phoneNumber);
  // In a real-world scenario, you would send the OTP via SMS here
  // For now, we'll just simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

 const sendmobileOtp = async (otp, mobile) => {
  try {
    const mnumber = mobile;

    const message =
      `${otp} is the OTP to login to your One Nation One Data (ONOD) account and is valid for 10 minutes. ` +
      `OTP is confidential. DO NOT share this OTP with anyone. ONOD Team. -AICTE`;

    const fullUrl = `${URL}${encodeURIComponent(message)}&mnumber=${mnumber}`;

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: fullUrl,
      headers: {
        Cookie: `JSESSIONID=${OTP_JSESSIONID}`,
      },
    };

    const response = await axios.request(config);
    console.log('OTP Sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

module.exports = {
  sendOtpToPhoneNumber,
  sendmobileOtp
};
