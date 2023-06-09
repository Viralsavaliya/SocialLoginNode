const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userdata'
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userdata'
        },
        message: {
            type: String,
        },
        status:{
            type:Number,
            default:0
        }
    },
    {
        timestamps: true,
      }
);

const message = mongoose.model("message", messageSchema);

module.exports = message;
