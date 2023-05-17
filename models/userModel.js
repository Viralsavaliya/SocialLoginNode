const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
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
    facebookId:{
      type:String
    },
    githubId:{
      type:String
    },
    twitterId:{
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
    }
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  address : "2dsphere",
});

const user = mongoose.model("users", userSchema);

module.exports = user;
