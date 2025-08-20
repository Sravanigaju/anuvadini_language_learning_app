const mongoose = require("mongoose");

const validatorSchema = new mongoose.Schema(
  {
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
  default: 'Validator' 
  },
    validated_content: { type: [String], required: true }, // e.g.,  all content that has been validated by the validator
    FullName:      { type: String, required: true },
    email:         { type: String,required: true ,unique: true, sparse: true },
    phoneNumber:   { type: String,required: true ,unique: true, sparse: true },
    password:      { type: String, required: true },


    Languages:              { type: [String], required: true },
    educationQualification: { type: String, required: true },
    QualificationCertificate: { type: String, required: true },
    yearsOfExperience:      { type: Number, required: true },
    projectLink:            String,
    linkedInProfile:        String,

    bio:                   { type: String, required: true },
    regionOfExpertise:    { type: String, required: true },

//mandatory fields for validator
    CurrentAdress:      { type: String, required: true ,unique: true},
    AdhaarNumber:       { type: Number, required: true },
    AdhaarPhoto :        { type: String, required: true },   //blob storage link here
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Validator", validatorSchema, "validators");
