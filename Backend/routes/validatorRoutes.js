const express = require("express");
const router  = express.Router();
const ctl     = require("../controllers/validatorAuthController");

// registration & auth
router.post("/register",      ctl.registerValidator);
router.post("/send-otp-phone",ctl.sendValidatorOtpPhone);
router.post("/send-otp-email",ctl.sendValidatorOtpEmail);
router.post("/verify-otp",    ctl.verifyValidatorOtp);
router.post("/login",         ctl.loginValidator);

module.exports = router;
