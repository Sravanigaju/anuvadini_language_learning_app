const Creator = require('../models/Creator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new Creator
exports.registerCreator = async (req, res) => {
  try {
    console.log('=== DEBUG: REGISTER CREATOR ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('ERROR: Empty request body');
      return res.status(400).json({ 
        success: false, 
        error: 'Request body is empty. Please provide Creator data.' 
      });
    }
    
    // Validate required fields
    const requiredFields = ['Status','FullName', 'email', 'phoneNumber', 'password', 'educationQualification', 'yearsOfExperience', 'languages'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('ERROR: Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Hash password
    console.log('Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
    // Create creator data with automatic status setting
    const creatorData = {
      ...req.body,
      password: hashedPassword,
      status: 'pending', // Automatically set status to pending
      courses_id: [] // Initialize empty courses array
    };
    
    console.log('Creating new Creator instance...');
    const creator = new Creator(creatorData);
    console.log('Creator instance created');
    
    console.log('Saving Creator to database...');
    const savedCreator = await creator.save();
    console.log('Creator saved successfully:', savedCreator._id);
    
    // Remove password from response for security
    const responseData = savedCreator.toObject();
    delete responseData.password;
    
    res.status(201).json({ 
      success: true, 
      message: 'Creator registered successfully. Account is pending verification.',
      data: responseData 
    });
    
  } catch (error) {
    console.log('ERROR in registerCreator:', error.message);
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

// Login Creator
exports.loginCreator = async (req, res) => {
  try {
    console.log('=== DEBUG: LOGIN CREATOR ===');
    console.log('Login attempt for:', req.body.email);
    
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Find creator by email
    console.log('Finding creator by email...');
    const creator = await Creator.findOne({ email });
    
    if (!creator) {
      console.log('Creator not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    console.log('Creator found:', creator.name);
    console.log('Creator status:', creator.status);
    
    // Check if creator is verified
    if (creator.status !== 'approved') {
      console.log('Creator not approved');
      return res.status(403).json({
        success: false,
        error: 'Account is not approved. Please contact administrator for approval.'
      });
    }
    
    // Verify password
    console.log('Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, creator.password);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { 
        creatorId: creator._id, 
        email: creator.email,
        status: creator.status 
      },
      process.env.JWT_SECRET || 'your-secret-key', // Use environment variable
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const responseData = creator.toObject();
    delete responseData.password;
    
    console.log('Login successful');
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        creator: responseData,
        token: token
      }
    });
    
  } catch (error) {
    console.log('ERROR in loginCreator:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Verify Creator (Change status from unverified to verified)
exports.verifyCreator = async (req, res) => {
  try {
    console.log('=== DEBUG: VERIFY CREATOR ===');
    const { id } = req.params;
    console.log('approving creator ID:', id);
    
    // Find creator by ID
    const creator = await Creator.findById(id);
    
    if (!creator) {
      console.log('Creator not found');
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }
    
    console.log('Creator found:', creator.name);
    console.log('Current status:', creator.status);
    
    // Check if already verified
    if (creator.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Creator is already approved'
      });
    }
    
    // Update status to verified
    console.log('Updating status to approved...');
    creator.status = 'approved';
    const updatedCreator = await creator.save();
    
    console.log('Creator approved successfully');
    
    // Remove password from response
    const responseData = updatedCreator.toObject();
    delete responseData.password;
    
    res.json({
      success: true,
      message: 'Creator approved successfully',
      data: responseData
    });
    
  } catch (error) {
    console.log('ERROR in approvingCreator:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all creators (for admin purposes)
exports.getAllCreators = async (req, res) => {
  try {
    console.log('=== DEBUG: GET ALL CREATORS ===');
    
    const creators = await Creator.find().select('-password');
    console.log('Found creators count:', creators.length);
    
    res.json({
      success: true,
      count: creators.length,
      data: creators
    });
    
  } catch (error) {
    console.log('ERROR in getAllCreators:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get creators by status (for admin purposes)
exports.getCreatorsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    console.log('=== DEBUG: GET CREATORS BY STATUS ===');
    console.log('Filtering by status:', status);
    
    const creators = await Creator.find({ status }).select('-password');
    console.log('Found creators count:', creators.length);
    
    res.json({
      success: true,
      count: creators.length,
      status: status,
      data: creators
    });
    
  } catch (error) {
    console.log('ERROR in getCreatorsByStatus:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};