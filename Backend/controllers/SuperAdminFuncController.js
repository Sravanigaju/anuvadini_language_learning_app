const SuperAdmin = require('../models/SuperAdminRegister');

const Creator = require("../models/Creator"); 
const Institution = require("../models/Institution"); // Adjust path as needed
const Validator = require("../models/Validator"); // Adjust path as needed

// GET: Get all fields from all models
exports.getAllFieldsFromAllModels = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, searchTerm } = req.query;
    
    // Build filter object for status if provided
    const filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    // Build search filter if searchTerm is provided
    let searchFilter = {};
    if (searchTerm) {
      searchFilter = {
        $or: [
          // Creator search fields
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { expertise: { $regex: searchTerm, $options: 'i' } },
          // Institution search fields
          { FullName: { $regex: searchTerm, $options: 'i' } },
          { institutionName: { $regex: searchTerm, $options: 'i' } },
          { Designation: { $regex: searchTerm, $options: 'i' } },
          // Validator search fields
          { regionOfExpertise: { $regex: searchTerm, $options: 'i' } },
          { bio: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Combine filters
    const combinedFilter = { ...filter, ...searchFilter };

    // Get data from all three models with pagination
    const [creators, institutions, validators] = await Promise.all([
      Creator.find(combinedFilter)
        .select('-password') // Exclude password
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 }),
      
      Institution.find(combinedFilter)
        .select('-password') // Exclude password
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 }),
      
      Validator.find(combinedFilter)
        .select('-password') // Exclude password
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
    ]);

    // Get total counts for pagination
    const [creatorsCount, institutionsCount, validatorsCount] = await Promise.all([
      Creator.countDocuments(combinedFilter),
      Institution.countDocuments(combinedFilter),
      Validator.countDocuments(combinedFilter)
    ]);

    // Add model type to each record for identification
    const creatorsWithType = creators.map(creator => ({
      ...creator.toObject(),
      modelType: 'creator'
    }));

    const institutionsWithType = institutions.map(institution => ({
      ...institution.toObject(),
      modelType: 'institution'
    }));

    const validatorsWithType = validators.map(validator => ({
      ...validator.toObject(),
      modelType: 'validator'
    }));

    // Combine all data
    const allData = [
      ...creatorsWithType,
      ...institutionsWithType,
      ...validatorsWithType
    ];

    // Sort combined data by createdAt
    allData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalRecords = creatorsCount + institutionsCount + validatorsCount;

    res.status(200).json({
      success: true,
      message: "All fields retrieved successfully from all models",
      data: {
        combined: allData,
        separate: {
          creators: creatorsWithType,
          institutions: institutionsWithType,
          validators: validatorsWithType
        },
        counts: {
          creators: creatorsCount,
          institutions: institutionsCount,
          validators: validatorsCount,
          total: totalRecords
        },
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          totalRecords: totalRecords,
          totalPages: Math.ceil(totalRecords / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving data from models",
      error: error.message
    });
  }
};

// GET: Get statistics from all models
exports.getAllModelsStatistics = async (req, res) => {
  try {
    // Get counts by status for each model
    const [creatorStats, institutionStats, validatorStats] = await Promise.all([
      Creator.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),
      Institution.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),
      Validator.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Get total counts
    const [totalCreators, totalInstitutions, totalValidators] = await Promise.all([
      Creator.countDocuments(),
      Institution.countDocuments(),
      Validator.countDocuments()
    ]);

    // Format statistics
    const formatStats = (stats) => {
      const result = { pending: 0, approved: 0, rejected: 0 };
      stats.forEach(stat => {
        result[stat._id] = stat.count;
      });
      return result;
    };

    res.status(200).json({
      success: true,
      message: "Statistics retrieved successfully",
      data: {
        creators: {
          total: totalCreators,
          byStatus: formatStats(creatorStats)
        },
        institutions: {
          total: totalInstitutions,
          byStatus: formatStats(institutionStats)
        },
        validators: {
          total: totalValidators,
          byStatus: formatStats(validatorStats)
        },
        overall: {
          totalUsers: totalCreators + totalInstitutions + totalValidators,
          totalByStatus: {
            pending: creatorStats.find(s => s._id === 'pending')?.count || 0 +
                    institutionStats.find(s => s._id === 'pending')?.count || 0 +
                    validatorStats.find(s => s._id === 'pending')?.count || 0,
            approved: creatorStats.find(s => s._id === 'approved')?.count || 0 +
                     institutionStats.find(s => s._id === 'approved')?.count || 0 +
                     validatorStats.find(s => s._id === 'approved')?.count || 0,
            rejected: creatorStats.find(s => s._id === 'rejected')?.count || 0 +
                     institutionStats.find(s => s._id === 'rejected')?.count || 0 +
                     validatorStats.find(s => s._id === 'rejected')?.count || 0
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving statistics",
      error: error.message
    });
  }
};









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