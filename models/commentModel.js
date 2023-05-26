const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentschema = new Schema(
  {
    comment: {
      type: String,    
    },
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



const comment = mongoose.model("Comment", commentschema);

module.exports = comment;
