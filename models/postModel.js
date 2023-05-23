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
    discripation: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    userid:{
        type: Schema.Types.ObjectId,
        ref: 'user' 
    }
  },
  {
    timestamps: true,
  }
);



const post = mongoose.model("post", postschema);

module.exports = post;
