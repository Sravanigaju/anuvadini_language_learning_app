const mongoose = require("mongoose");

const validatorSchema = new mongoose.Schema(
  {
 
    username:      { type: String, required: true },
    email:         { type: String, unique: true, sparse: true },
    phoneNumber:   { type: String, unique: true, sparse: true },
    password:      { type: String, required: true },

    otp:        String,
    otpExpiry:  Date,
    isVerified: { type: Boolean, default: false },


    yearsOfExperience:     Number,
    educationQualification:String,
    region:                String,
    location:              String,
    languages:            [String],
    bio:                   String,
    projectLinks:         [String],


    idProofUrl:    String,
    certificateUrl:String,

    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Validator", validatorSchema, "validators");
