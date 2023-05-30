const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followschema = new Schema(
    {
        followerId: {
            type: Schema.Types.ObjectId,
            ref: 'userdata'
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'userdata'
        },
        status: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);



const follow = mongoose.model("follow", followschema);

module.exports = follow;
