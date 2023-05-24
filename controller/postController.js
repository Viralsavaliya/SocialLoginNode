const Post = require('../models/postModel')
const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.getallpost = async (req, res) => {
    try {
        const post = await Post.find();

        res.status(200).json({
          success : true,
          data : post,
          message : "Post get successfully"
        });
    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
          });
        
    }
}


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
  
  exports.oneuserpost = async (req, res) => {
    try {
        const {id} = req.user;
        const post = await Post.find({userid: id});

        res.status(200).json({
          success : true,
          data : post,
          message : "Post get successfully"
        });
    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
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
      if (fs.existsSync(path.join(__dirname,"../uploads/" + image))) {
        fs.unlinkSync(path.join(__dirname,"../uploads/" + image));
      }
    }
    const deletepost = await Post.deleteOne({ _id: id });

      res.status(200).json({
        success : true,
        data : deletepost,
        message : "Post delete successfully"
      });
  } catch (error) {
      res.status(400).json({
          success : false,
          message : error.message
        });
      
  }
}
  