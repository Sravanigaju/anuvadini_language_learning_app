const Validator = require("../models/Validator"); // Adjust path as needed
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST: Register a new Validator
const registerValidator = async (req, res) => {
  try {
    const {
      Status,
      FullName,
      email,
      phoneNumber,
      password,
      Languages,
      educationQualification,
      QualificationCertificate,
      yearsOfExperience,
      projectLink,
      linkedInProfile,
      bio,
      regionOfExpertise,
      CurrentAdress,
      AdhaarNumber,
      AdhaarPhoto
    } = req.body;

    // Check if validator already exists
    const existingValidator = await Validator.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingValidator) {
      return res.status(400).json({
        success: false,
        message: "Validator with this email or phone number already exists"
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new validator with pending status
    const validator = new Validator({
      Status,
      validated_content: [], // Empty array initially
      FullName,
      email,
      phoneNumber,
      password: hashedPassword,
      Languages,
      educationQualification,
      QualificationCertificate,
      yearsOfExperience,
      projectLink,
      linkedInProfile,
      bio,
      regionOfExpertise,
      CurrentAdress,
      AdhaarNumber,
      AdhaarPhoto
    });

    const savedValidator = await validator.save();
    
    // Remove password from response
    const validatorResponse = savedValidator.toObject();
    delete validatorResponse.password;

    res.status(201).json({
      success: true,
      message: "Validator registered successfully. Your application is pending approval.",
      data: validatorResponse
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field} is already registered`
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// POST: Login Validator
const loginValidator = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find validator by email
    const validator = await Validator.findOne({ email });
    
    if (!validator) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if validator is approved
    if (validator.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: `Your account is ${validator.status}. Please wait for admin approval.`
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, validator.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: validator._id,
        email: validator.email,
        role: 'validator'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const validatorResponse = validator.toObject();
    delete validatorResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        validator: validatorResponse,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PATCH: Approve Validator
const approveValidator = async (req, res) => {
  try {
    const { id } = req.params;

    const validator = await Validator.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true, runValidators: true }
    ).select('-password');

    if (!validator) {
      return res.status(404).json({
        success: false,
        message: "Validator not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Validator approved successfully",
      data: validator
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// PATCH: Reject Validator
const rejectValidator = async (req, res) => {
  try {
    const { id } = req.params;

    const validator = await Validator.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true, runValidators: true }
    ).select('-password');

    if (!validator) {
      return res.status(404).json({
        success: false,
        message: "Validator not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Validator rejected successfully",
      data: validator
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET: Get all validators
const getAllValidators = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, Languages } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (Languages) filter.Languages = { $in: [Languages] };

    const validators = await Validator.find(filter)
      .select('-password') // Exclude password from results
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Validator.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: validators,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: validators.length,
        totalRecords: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET: Get validators by status
const getValidatorsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate status
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be approved, pending, or rejected"
      });
    }

    const validators = await Validator.find({ status })
      .select('-password') // Exclude password from results
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Validator.countDocuments({ status });

    res.status(200).json({
      success: true,
      data: validators,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: validators.length,
        totalRecords: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET: Get validator by ID
const getValidatorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const validator = await Validator.findById(id).select('-password');
    
    if (!validator) {
      return res.status(404).json({
        success: false,
        message: "Validator not found"
      });
    }

    res.status(200).json({
      success: true,
      data: validator
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update validator
const updateValidator = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password is being updated, hash it
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const validator = await Validator.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!validator) {
      return res.status(404).json({
        success: false,
        message: "Validator not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Validator updated successfully",
      data: validator
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field} is already in use`
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete validator
const deleteValidator = async (req, res) => {
  try {
    const { id } = req.params;
    
    const validator = await Validator.findByIdAndDelete(id);
    
    if (!validator) {
      return res.status(404).json({
        success: false,
        message: "Validator not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Validator deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add validated content to a validator
const addValidatedContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { contentId } = req.body;

    const validator = await Validator.findByIdAndUpdate(
      id,
      { $addToSet: { validated_content: contentId } }, // $addToSet prevents duplicates
      { new: true, runValidators: true }
    ).select('-password');

    if (!validator) {
      return res.status(404).json({
        success: false,
        message: "Validator not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Content added to validated list",
      data: validator
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get validators by language
const getValidatorsByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    
    const validators = await Validator.find({
      Languages: { $in: [language] },
      status: 'approved' // Only get approved validators
    }).select('-password -AdhaarNumber -AdhaarPhoto'); // Exclude sensitive info

    res.status(200).json({
      success: true,
      data: validators,
      count: validators.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerValidator,
  loginValidator,
  approveValidator,
  rejectValidator,
  getAllValidators,
  getValidatorsByStatus,
  getValidatorById,
  updateValidator,
  deleteValidator,
  addValidatedContent,
  getValidatorsByLanguage
};