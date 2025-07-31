const mongoose = require("mongoose");

const validatorSchema = new mongoose.Schema(
  {
 
    FullName:      { type: String, required: true },
    email:         { type: String,required: true ,unique: true, sparse: true },
    phoneNumber:   { type: String,required: true ,unique: true, sparse: true },
    password:      { type: String, required: true },


    Languages:              { type: [String], required: true },
    educationQualification: String,
    yearsOfExperience:      Number,
    projectLink:            String,
    linkedInProfile:        String,
    bio:                    String,
    regionOfExpertise:      String,

    CurrentAdress:          String,
    AdhaarNumber:           Number,
    AdhaarPhoto :           String,   //blob storage link 

    
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Validator", validatorSchema, "validators");
