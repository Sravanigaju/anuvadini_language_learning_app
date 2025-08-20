const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
  courses_id: { type: [String], default: [] }, // All courses created by the institution
  Status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  role: { 
  type: String, 
  required: true, 
  enum: ['SuperAdmin','Validator', 'ContentCreator', 'Institute'], 
  default: 'Institute' 
  },
  FullName: { type: String, required: true },
  Designation: { type: String, required: true },
  institutionName: { type: String, required: true },
  instituteType: { type: String, required: true },
  Affilliations: { type: String, required: true },
  websiteDomain: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true, required: true },
  password: { type: String, required: true },
  
  address: { type: String, required: true },
  description: String,
  rejectionReason: String, // Optional field for rejection reason
}, { 
  timestamps: true, 
  versionKey: false 
});

module.exports = mongoose.model("Institution", institutionSchema, "institutions");