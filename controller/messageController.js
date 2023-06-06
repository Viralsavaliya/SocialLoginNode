const Message = require('../models/messageModel')
const User = require('../models/userModel');
const multer = require("multer");

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

exports.addmessage = async (req, res) => {
  let datafilename;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/chat");
    },
    filename: (req, file, cb) => {
      const fileExtension = file.originalname.split(".").pop();

      if (fileExtension === "jpeg" || fileExtension === "jpg" || fileExtension === "png") {
        cb(null, "image-" + Date.now() + "." + fileExtension);
      } else if (fileExtension === "mp4") {
        cb(null, "video-" + Date.now() + "." + fileExtension);
      } else {
        cb(new Error("Unsupported file type"));
      }
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
    console.log(datafilename, "datafilename");

    res.status(200).json({
      success: true,
      data: datafilename,
      message: "Upload complete"
    });
  });
};




