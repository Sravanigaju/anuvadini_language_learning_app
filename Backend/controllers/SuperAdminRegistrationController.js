const SuperAdmin = require('../models/SuperAdmin');

const generateOtp = require("../utils/generateOtp");
const { sendOtpToPhoneNumber } = require("../utils/sendOtpSms");
const { sendOtpToEmail } = require("../utils/sendOtpEmail");

// Create a new SuperAdmin
exports.createSuperAdmin = async (req, res) => {
  try {
    console.log('=== DEBUG: CREATE SUPERADMIN ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('ERROR: Empty request body');
      return res.status(400).json({ 
        success: false, 
        error: 'Request body is empty. Please provide SuperAdmin data.' 
      });
    }
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phoneNumber', 'password', 'designation', 'Age'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('ERROR: Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    console.log('Creating new SuperAdmin instance...');
    const superAdmin = new SuperAdmin(req.body);
    console.log('SuperAdmin instance created');
    
    console.log('Saving SuperAdmin to database...');
    const savedSuperAdmin = await superAdmin.save();
    console.log('SuperAdmin saved successfully:', savedSuperAdmin._id);
    
    // Remove password from response for security
    const responseData = savedSuperAdmin.toObject();
    delete responseData.password;
    
    res.status(201).json({ 
      success: true, 
      message: 'SuperAdmin created successfully',
      data: responseData 
    });
    
  } catch (error) {
    console.log('ERROR in createSuperAdmin:', error.message);
    console.log('Full error:', error);
    
    // Handle duplicate key errors (unique constraints)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${duplicateField} already exists. Please use a different ${duplicateField}.`
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: validationErrors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get all SuperAdmins
exports.getAllSuperAdmins = async (req, res) => {
  try {
    console.log('=== DEBUG: GET ALL SUPERADMINS ===');
    
    // Find all SuperAdmins but exclude password field
    const superAdmins = await SuperAdmin.find().select('-password');
    console.log('Found SuperAdmins count:', superAdmins.length);
    
    res.json({ 
      success: true, 
      count: superAdmins.length,
      data: superAdmins 
    });
    
  } catch (error) {
    console.log('ERROR in getAllSuperAdmins:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get SuperAdmin by ID
exports.getSuperAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== DEBUG: GET SUPERADMIN BY ID ===');
    console.log('Searching for SuperAdmin ID:', id);
    
    const superAdmin = await SuperAdmin.findById(id).select('-password');
    
    if (!superAdmin) {
      console.log('SuperAdmin not found');
      return res.status(404).json({ 
        success: false, 
        message: 'SuperAdmin not found' 
      });
    }
    
    console.log('SuperAdmin found:', superAdmin.name);
    res.json({ 
      success: true, 
      data: superAdmin 
    });
    
  } catch (error) {
    console.log('ERROR in getSuperAdminById:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.sendOtpEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOtp();
    await sendOtpToEmail(email, otp);
    res.status(200).json({ data: otp, message: "OTP sent via Email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  

  try {
     //const otp = generateOtp();
    const otp = "123456";

    await sendOtpToPhoneNumber(phoneNumber, otp);

    res.status(200).json({ data: otp ,message: "OTP sent via SMS" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};