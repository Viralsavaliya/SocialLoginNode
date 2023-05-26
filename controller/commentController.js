const Comment = require('../models/commentModel')


exports.getallcomment = async (req, res) => {
    try {
        const comment = await Comment.find();


        res.status(200).json({
            success: true,
            data: comment,
            message: 'All Comment Get Successfully'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.addcomment = async (req, res) => {
    try {
        const { postid , comment } = req.body;
        const userId = req.user._id

        const newcomment ={
            postid,
            comment,
            userid: userId
        };
        const savecomment = await Comment.create(newcomment);

        res.status(200).json({
            success: true,
            data: savecomment,
            message: 'Add commemt successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

exports.deletecomment = async (req, res) => {
    try {
        const userid = req.user._id
        const {postid} = req.query;

        const deletecomment = await Comment.deleteOne({ postid: postid, userid: userid});

        res.status(200).json({
            success:true,
            data:deletecomment,
            message:'delet comment  successfully'
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}