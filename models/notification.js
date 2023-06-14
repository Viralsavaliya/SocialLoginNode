const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationschema = new Schema(
  {
    title: {
      type: String,
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdata'
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdata'
    }
  },
  {
    timestamps: true,
  }
);



const notification = mongoose.model("notification", notificationschema);

module.exports = notification;
