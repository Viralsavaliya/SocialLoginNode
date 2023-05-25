const Like = require('../models/likeModel');

exports.getalllike = async (req, res) => {
    try {
        const alllike = await Like.find();

        res.status(200).json({
            success:true,
            data:alllike,
            message:'All likes Get successfully'
        });
    } catch (error) {
        res.status(200).json({
            success:false,
            message:error.message
        });
    }
}


exports.addlike = async (req, res) => {
    try {
        const {postid} = req.body;
        const userId = req.user._id

        const newlike = new Like({
            postid,
            userid:userId
        });
        const savelike = await newlike.save();

        res.status(200).json({
            success:true,
            data:savelike,
            message:'Add likes successfully'
        });
    } catch (error) {
        res.status(200).json({
            success:false,
            message:error.message
        });
    }
    }

exports.deletelike = async (req, res) => {
    try {

        const {postid,userid} = req.query;

        const deletelike = await Like.deleteOne({ postid: postid, userid: userid});

        res.status(200).json({
            success:true,
            data:deletelike,
            message:'delet likes successfully'
        });
    } catch (error) {
        res.status(200).json({
            success:false,
            message:error.message
        });
    }
}