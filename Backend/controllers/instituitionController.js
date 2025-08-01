const Institution = require('../models/Institution');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new Institution
exports.registerInstitution = async (req, res) => {
  try {
    console.log('=== DEBUG: REGISTER INSTITUTION ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('ERROR: Empty request body');
      return res.status(400).json({ 
        success: false, 
        error: 'Request body is empty. Please provide Institution data.' 
      });
    }
    
    // Validate required fields
    const requiredFields = ['Status', 'FullName', 'Designation', 'institutionName', 'instituteType', 'Affilliations', 'websiteDomain', 'phoneNumber', 'email', 'password', 'address'];
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
    
    // Create institution data with automatic status setting
    const institutionData = {
      ...req.body,
      password: hashedPassword,
      status: 'pending', // Automatically set status to pending
      courses_id: [] // Initialize empty courses array
    };
    
    console.log('Creating new Institution instance...');
    const institution = new Institution(institutionData);
    console.log('Institution instance created');
    
    console.log('Saving Institution to database...');
    const savedInstitution = await institution.save();
    console.log('Institution saved successfully:', savedInstitution._id);
    
    // Remove password from response for security
    const responseData = savedInstitution.toObject();
    delete responseData.password;
    
    res.status(201).json({ 
      success: true, 
      message: 'Institution registered successfully. Account is pending approval.',
      data: responseData 
    });
    
  } catch (error) {
    console.log('ERROR in registerInstitution:', error.message);
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

// Login Institution
exports.loginInstitution = async (req, res) => {
  try {
    console.log('=== DEBUG: LOGIN INSTITUTION ===');
    console.log('Login attempt for:', req.body.email);
    
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Find institution by email
    console.log('Finding institution by email...');
    const institution = await Institution.findOne({ email });
    
    if (!institution) {
      console.log('Institution not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    console.log('Institution found:', institution.institutionName);
    console.log('Institution status:', institution.status);
    
    // Check if institution is approved
    if (institution.status !== 'approved') {
      console.log('Institution not approved');
      return res.status(403).json({
        success: false,
        error: 'Account is not approved. Please contact administrator for approval.',
        currentStatus: institution.status
      });
    }
    
    // Verify password
    console.log('Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, institution.password);
    
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
        institutionId: institution._id, 
        email: institution.email,
        status: institution.status,
        institutionName: institution.institutionName
      },
      process.env.JWT_SECRET || 'your-secret-key', // Use environment variable
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const responseData = institution.toObject();
    delete responseData.password;
    
    console.log('Login successful');
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        institution: responseData,
        token: token
      }
    });
    
  } catch (error) {
    console.log('ERROR in loginInstitution:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Approve Institution (Change status from pending to approved)
exports.approveInstitution = async (req, res) => {
  try {
    console.log('=== DEBUG: APPROVE INSTITUTION ===');
    const { id } = req.params;
    console.log('Approving institution ID:', id);
    
    // Find institution by ID
    const institution = await Institution.findById(id);
    
    if (!institution) {
      console.log('Institution not found');
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }
    
    console.log('Institution found:', institution.institutionName);
    console.log('Current status:', institution.status);
    
    // Check if already approved
    if (institution.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Institution is already approved'
      });
    }
    
    // Update status to approved
    console.log('Updating status to approved...');
    institution.status = 'approved';
    const updatedInstitution = await institution.save();
    
    console.log('Institution approved successfully');
    
    // Remove password from response
    const responseData = updatedInstitution.toObject();
    delete responseData.password;
    
    res.json({
      success: true,
      message: 'Institution approved successfully',
      data: responseData
    });
    
  } catch (error) {
    console.log('ERROR in approveInstitution:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Reject Institution (Change status to rejected)
exports.rejectInstitution = async (req, res) => {
  try {
    console.log('=== DEBUG: REJECT INSTITUTION ===');
    const { id } = req.params;
    const { reason } = req.body; // Optional rejection reason
    
    console.log('Rejecting institution ID:', id);
    
    // Find institution by ID
    const institution = await Institution.findById(id);
    
    if (!institution) {
      console.log('Institution not found');
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }
    
    console.log('Institution found:', institution.institutionName);
    console.log('Current status:', institution.status);
    
    // Update status to rejected
    console.log('Updating status to rejected...');
    institution.status = 'rejected';
    if (reason) {
      institution.rejectionReason = reason; // Add rejection reason if provided
    }
    const updatedInstitution = await institution.save();
    
    console.log('Institution rejected successfully');
    
    // Remove password from response
    const responseData = updatedInstitution.toObject();
    delete responseData.password;
    
    res.json({
      success: true,
      message: 'Institution rejected successfully',
      data: responseData
    });
    
  } catch (error) {
    console.log('ERROR in rejectInstitution:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all institutions (for admin purposes)
exports.getAllInstitutions = async (req, res) => {
  try {
    console.log('=== DEBUG: GET ALL INSTITUTIONS ===');
    
    const institutions = await Institution.find().select('-password');
    console.log('Found institutions count:', institutions.length);
    
    res.json({
      success: true,
      count: institutions.length,
      data: institutions
    });
    
  } catch (error) {
    console.log('ERROR in getAllInstitutions:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get institutions by status (for admin purposes)
exports.getInstitutionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    console.log('=== DEBUG: GET INSTITUTIONS BY STATUS ===');
    console.log('Filtering by status:', status);
    
    const institutions = await Institution.find({ status }).select('-password');
    console.log('Found institutions count:', institutions.length);
    
    res.json({
      success: true,
      count: institutions.length,
      status: status,
      data: institutions
    });
    
  } catch (error) {
    console.log('ERROR in getInstitutionsByStatus:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get institution by ID
exports.getInstitutionById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== DEBUG: GET INSTITUTION BY ID ===');
    console.log('Searching for Institution ID:', id);
    
    const institution = await Institution.findById(id).select('-password');
    
    if (!institution) {
      console.log('Institution not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Institution not found' 
      });
    }
    
    console.log('Institution found:', institution.institutionName);
    res.json({ 
      success: true, 
      data: institution 
    });
    
  } catch (error) {
    console.log('ERROR in getInstitutionById:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};