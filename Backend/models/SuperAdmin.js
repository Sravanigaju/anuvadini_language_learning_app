const mongoose =require('mongoose');

const SuperAdminSchema= new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    phoneNumber:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    designation:{type:String, required:true},
    Age:{type:Number, required:true},

},
{
    timestamps:true,
    versionKey:false
});

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema, 'SuperAdmins');








