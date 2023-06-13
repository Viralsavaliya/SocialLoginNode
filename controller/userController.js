const User = require('../models/userModel')
const Follow = require('../models/followModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require("multer");
const path = require("path");

exports.getalluser = async (req, res) => {
    try {
        const user = await User.find();

        res.status(200).json({
            success: true,
            data: user,
            message: "All user get Successfully"
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}



exports.addUser = async (req, res) => {

    try {
        const { userName, email, password, age } = req.body

        const newuser = {
            userName,
            email,
            password,
            age
        }

        const finaluser = await User.create(newuser);

        res.status(200).json({
            success: true,
            data: finaluser,
            message: "add user successfully"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const finduser = await User.findOne({ email });

        if (!finduser) {
            const error = new error('Invalid email Or password');
            error.statuscode = 404;
            throw error
        }

       

        const validpw = await bcrypt.compare(password, finduser.password)

        if (!validpw) {
            const error = new error('Invalid email Or password');
            error.statuscode = 404;
            throw error
        }
        const payload = {
            id: finduser.id,
            email: finduser.email
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '24h'
        })

        finduser.login_token = token

        await finduser.save()



        res.status(200).json({
            success: true,
            data: token,
            message: "User login successfully"
        })


    } catch (error) {
        res.status(200).json({
            success: false,
            message: "User not login "
        })
    }
}

exports.getoneuser = async (req, res) => {
    try {
        const id = req.user.id;
        
        const finduser = await User.findById(id);

        if (!finduser) {
            const error = new error('Invalid email Or password');
            error.statuscode = 404;
            throw error
        }

        res.status(200).json({
            success: true,
            data: finduser,
            message: "User get Successfully"
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
};

exports.updateprofile = async (req, res) => {
    try {
        const id = req.user;
        const finduser =    await User.findById(id);

        if (!finduser) {
            const error = new error('Invalid email Or password');
            error.statuscode = 404;
            throw error
        }

        finduser.userName = req.body.userName ? req.body.userName : finduser.userName;
        finduser.email = req.body.email ? req.body.email : finduser.email;
        finduser.age = req.body.age ? req.body.age : finduser.age;
        finduser.image = req.body.image ? req.body.image : finduser.image;
        finduser.mobileNo = req.body.mobileNo ? req.body.mobileNo : finduser.mobileNo;
        const latitude = req.body.address?.lat ?? finduser.address?.coordinates[0] ?? 0;
        const longitude = req.body.address?.lng ?? finduser.address?.coordinates[1] ?? 0;
        // finduser.status = req.body.status ? req.body.status : finduser.status;

        finduser.address = {
            type: 'Point',
            coordinates: [parseFloat(latitude), parseFloat(longitude)],
        };
        finduser.gender = req.body.gender ? req.body.gender : finduser.gender;

        await finduser.save();

        res.status(200).json({
            success: true,
            data: finduser,
            message: "User get Successfully"
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
};


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

exports.deletedaccount = async (req, res) => {
    try {
        const id = req.user;
        const finduser = await User.findOne({_id:id});

        finduser.deletedstatus = false;

        const updateuser =  await finduser.save();

        return res.status(200).json({
            success: true,
            data:updateuser,
            message:"Deleted message successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:error.message
        })
    }
}




