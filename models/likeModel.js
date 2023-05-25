const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeschema = new Schema(
  {
    postid:{
        type: Schema.Types.ObjectId,
        ref: 'post' 
    },
    userid:{
        type: Schema.Types.ObjectId,
        ref: 'userdata' 
    },
    
  },
  {
    timestamps: true,
  }
);



const like = mongoose.model("Like", likeschema);

module.exports = like;
