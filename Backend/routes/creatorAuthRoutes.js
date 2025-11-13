const express = require("express");
const router = express.Router();
const creatorAuth = require("../controllers/creatorAuthController");

router.post("/register", creatorAuth.registerCreator);
router.post("/verify-otp", creatorAuth.verifyCreatorOtp);
router.post("/login", creatorAuth.loginCreator);
router.post("/send-otp-phone", creatorAuth.sendOtpToCreatorPhone);
router.post("/send-otp-email", creatorAuth.sendOtpToCreatorEmail);

module.exports = router;
 