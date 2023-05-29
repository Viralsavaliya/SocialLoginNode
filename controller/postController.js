const Post = require('../models/postModel')
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Like = require("../models/likeModel");
const { ObjectId } = require('mongoose').Types;

exports.getallpost = async (req, res) => {
  try {
    const userId = new ObjectId(req.user.id);
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 3; // Number of posts per page

    const pipeline = [
      { $match: { status: 'Approved' } },
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$postid', '$$postId'] },
                userid: userId
              },
            },
          ],
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$postid', '$$postId'] },
              },
            },
          ],
          as: 'likescount',
        },
      },
      {
        $lookup: {
          from: 'userdatas',
          localField: 'userid',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $addFields: {
          likescount: { $size: '$likescount' },
          debugLikes: '$likes',
          isLikedByUser: { $ne: ['$likes', []] },
        },
      },
      {
        $lookup: {
          from: 'userdatas',
          localField: 'userid',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'comments',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$postid', '$$postId'] },
              },
            },
            {
              $lookup: {
                from: 'userdatas',
                localField: 'userid',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $addFields: {
                userName: { $arrayElemAt: ['$user.userName', 0] },
                image: { $arrayElemAt: ['$user.image', 0] },
              },
            },
            {
              $project: {
                _id: 0,
                comment: 1,
                userId: 1,
                userName: 1,
                image: 1,
              },
            },
          ],
          as: 'comments',
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          discripation: 1,
          image: 1,
          status: 1,
          userid: 1,
          userName: { $arrayElemAt: ['$user.userName', 0] },
          userimage: { $arrayElemAt: ['$user.image', 0] },
          likescount: 1,
          isLikedByUser: 1,
          comments: 1
        },
      },
      {
        $skip: (page - 1) * limit, // Skips documents based on the current page and limit
      },
      {
        $limit: limit, // Limits the number of documents per page
      },
    ];

    const countPipeline = [
      { $match: { status: 'Approved' } },
      { $count: 'total' }, // Count the total number of documents
    ];

    const [post, countResult] = await Promise.all([
      Post.aggregate(pipeline),
      Post.aggregate(countPipeline),
    ]);

    const totalPosts = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      data: post,
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        postsPerPage: limit,
      },
      message: 'Posts retrieved successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};






exports.addpost = async (req, res) => {
  try {
    let datafilename;

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads");
      },
      filename: (req, file, cb) => {
        cb(
          null,
          file.fieldname + "-" + Date.now() + "." + file.originalname.split(".").pop()
        );
      },
    });

    const upload = multer({ storage: storage }).single("file");

    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error uploading file",
        });
      }

      const fileName = req.file?.filename;
      datafilename = fileName;

      // Proceed with creating the post
      const { id } = req.user;
      const { title, discripation } = req.body;

      const newPost = {
        title,
        image: datafilename,
        discripation,
        userid: id,
      };

      const post = await Post.create(newPost);

      return res.status(200).json({
        success: true,
        data: post,
        message: "Post created successfully",
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatepost = async (req, res) => {
  try {



    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads");
      },
      filename: (req, file, cb) => {
        cb(
          null,
          file.fieldname + "-" + Date.now() + "." + file.originalname.split(".").pop()
        );
      },
    });

    const upload = multer({ storage: storage }).single("file");

    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error uploading file",
        });
      }
    })

    let datafilename;

    const { id } = req.params;

    const findpost = await Post.findById({ _id: id });

    const deleteimage = findpost.image;

    const { title, discripation } = req.body;

    findpost.title = findpost.title === "" ? findpost.title : title;
    findpost.discripation = findpost.discripation === "" ? findpost.discripation : discripation;
    findpost.image = req.file ? req.file.filename : deleteimage;

    if (req.file && fs.existsSync(path.join(__dirname, "../uploads/") + deleteimage)) {
      fs.unlinkSync(path.join(__dirname, "../uploads/") + deleteimage);
    }

    const saveblog = await findpost.save();

    return res.status(200).json({
      success: true,
      data: saveblog,
      message: "post update Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}



exports.oneuserpost = async (req, res) => {
  try {
    const { id } = req.user;
    const post = await Post.find({ userid: id });

    res.status(200).json({
      success: true,
      data: post,
      message: "Post get successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}

exports.deletepost = async (req, res) => {
  try {
    const { id } = req.params;
    const findpost = await Post.findById({ _id: id });


    const image = findpost.image;
    if (image) {
      console.log(image);
      if (fs.existsSync(path.join(__dirname, "../uploads/" + image))) {
        fs.unlinkSync(path.join(__dirname, "../uploads/" + image));
      }
    }
    const deletepost = await Post.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      data: deletepost,
      message: "Post delete successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}

