const axios = require("axios");

const sendOtpToPhoneNumber = async (phoneNumber, otp) => {
  console.log(`OTP for ${phoneNumber}: ${otp}`);
  await sendmobileOtp(otp, phoneNumber);
  // In a real-world scenario, you would send the OTP via SMS here
  // For now, we'll just simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const sendmobileOtp = async (otp, mobile) => {
  try {
    let mnumber = mobile;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        "http://smsgw.sms.gov.in/failsafe/HttpLink?username=aictein.sms&pin=E7%25nD5%26nS7&message=" +
        otp +
        " is the OTP to login to your One Nation One Data (ONOD) account and is valid for 10 minutes. OTP is confidential. DO NOT share this OTP with anyone. ONOD Team. -AICTE&mnumber=" +
        mnumber +
        "&signature=AICTED&dlt_entity_id=1101520230000040605&dlt_template_id=1107170504443505502",
      headers: {
        Cookie: "JSESSIONID=zQiou5p3KN4YAyaPAGefIpi_D0NQBx4mezkayWc5.ng-103",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("OTP Sent.", response);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error;
  }
};

module.exports = {
  sendOtpToPhoneNumber,
  sendmobileOtp
};
