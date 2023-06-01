const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postschema = new Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    video:{
      type:String,
    },
    discripation: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    userid:{
        type: Schema.Types.ObjectId,
        ref: 'userdata' 
    }
  },
  {
    timestamps: true,
  }
);



const post = mongoose.model("post", postschema);

module.exports = post;
