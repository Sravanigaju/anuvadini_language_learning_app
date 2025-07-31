const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
  Name:{type: String, required: true},
  Designation:{type: String, required: true},
  institutionName: {type: String,required: true},
  instituteType:{type: String, required: true},
  Affilliations: {type: String, required: true},
  websiteDomain:{type: String, required: true},
  phoneNumber: {type: String,required: true,unique: true,required: true},
  email: {type: String,unique: true,sparse: true,required: true,},
  password: {type: String,required: true,},
  
  address:{type: String, required: true,},
  
  description: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model("Institution", institutionSchema);
