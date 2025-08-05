const express = require('express');
const router = express.Router();
const SuperAdmin = require('../controllers/SuperAdminFuncController');


router.get('/phone', SuperAdmin.sendOtp); 
router.get('/email', SuperAdmin.sendOtpEmail); 

module.exports = router;