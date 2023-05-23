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


// exports.addpost = async (req, res) => {
//     try {
//         let datafilename
//         const storage = multer.diskStorage({
//             destination: (req, file, cb) => {
//               cb(null, "uploads");
//             },
//             filename: (req, file, cb) => {
//               cb(
//                 null,
//                 file.fieldname +
//                   "-" +
//                   Date.now() +
//                   "." +
//                   file.originalname.split(".").pop()
//               );
//             },
//           });
//           const upload = multer({ storage: storage }).single("image");
//           upload(req, res, async function (err) {
//             const fileName = req.file.filename;
//              datafilename = fileName?.filename });

//         const {id} = req.user;
//         const {title  , discripation } = req.body;
//         const newpost = {
//             title,
//             image:datafilename,
//             discripation,
//             userid:id
//         }
//         const post = await Post.create(newpost);

//         res.status(200).json({
//           success : true,
//           data : post,
//           message : "Post get successfully"
//         });
//     } catch (error) {
//         res.status(400).json({
//             success : false,
//             message : error.message
//           });
        
//     }
// }

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
  
      const upload = multer({ storage: storage }).single("image");
  
      // Middleware to handle the file upload
      upload(req, res, async function (err) {
        if (err) {
          // Handle any upload errors
          return res.status(400).json({
            success: false,
            message: "Error uploading file",
          });
        }
  
        const fileName = req.file.filename;
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
  