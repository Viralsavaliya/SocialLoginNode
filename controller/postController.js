const Post = require('../models/postModel')
const multer = require("multer");

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname +
          "-" +
          Date.now() +
          "." +
          file.originalname.split(".").pop()
      );
    },
  });
  const upload = multer({ storage: storage }).single("file");
  
  exports.uploadimage = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        const fileName = req.file;
        if (err) {
          return res.end("Error uploading file.");
        }
        const datafilename = fileName?.filename 
        return res.status(200).json({
          success: true,
          data: datafilename,
          message: "File uploaded successfully.",
        });
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  };


exports.addpost = async (req, res) => {
    try {

        const {id} = req.user._id;
        const {title , image , discripation } = req.body;
        const newpost = {
            title,
            image,
            discripation,
            userid:id
        }
        const post = await Post.create(newpost);

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