const Message = require('../models/messageModel')
const User = require('../models/userModel');

exports.getallmeasage = async (req, res) => {
    try {

        const messages = await Message.find();

        res.status(200).json({
            success: true,
            data: messages,
            message: "All Messages get Successfully",
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


exports.chatPage = async (req, res) => {

    const userId = req.user._id
    const user1 = User.findById(userId);
    const users1 = User.find({ _id: { $ne: userId } });

    const [users, user] = await Promise.all([users1, user1])
    res.status(200).json({
        users,
        logInUser: user
    });
};


