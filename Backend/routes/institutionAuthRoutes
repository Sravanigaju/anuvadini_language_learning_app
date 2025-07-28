const express = require("express");
const router = express.Router();
const ctl = require("../controllers/institutionAuthController");

router.post("/register", ctl.registerInstitution);
router.post("/send-otp-phone", ctl.sendInstitutionOtpPhone);
router.post("/send-otp-email", ctl.sendInstitutionOtpEmail);
router.post("/verify-otp", ctl.verifyInstitutionOtp);
router.post("/login", ctl.loginInstitution);

module.exports = router;
