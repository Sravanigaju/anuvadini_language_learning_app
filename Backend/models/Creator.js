const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
  courses_id: { type: [String], default: [] }, // all courses created by the creator
 Status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  FullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, required: true },
  phoneNumber: { type: String, unique: true, sparse: true, required: true },
  password: { type: String, required: true },
  
  educationQualification: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  expertise: String,
  portfolio: String,

  linkedinUrl: String,
  languages: { type: [String], required: true },
  projectLinks: [String],
  bio: String,
}, { 
  timestamps: true, 
  versionKey: false 
});

module.exports = mongoose.model("Creator", creatorSchema, "creators");