const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    adminName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
    googleId:{
      type:String
    },
    githubId:{
      type:String
    },
    mobileNo:{
      type:Number 
    },
    address:{
      type: {
        type: String,
        enum: ['Point']
    },
    coordinates: {
        type: [Number]
    },
    },  
    gender:{
      type:String
    },
    image:{
      type:String
    },
    otp:{
      type:String,
      default:null
    }
  },
  {
    timestamps: true,
  }
);

adminSchema.index({
  address : "2dsphere",
});

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;
