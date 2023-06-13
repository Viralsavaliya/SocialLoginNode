const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const Post = require('../models/postModel');

exports.getalladmin = async (req, res) => {
    try {
        const admin = await Admin.find();

        res.status(200).json({
            success: true,
            data: admin,
            Message: "All Admin Get Successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            Message: error.Message
        });
    }
}

exports.adminregister = async (req, res) => {
    try {
        const { adminName, email, password } = req.body
        const hashpw = await bcrypt.hash(password, 10)
        const admin = {
            adminName,
            email,
            password: hashpw
        };
        const adminuser = await Admin.create(admin);

        res.status(200).json({
            success: true,
            data: adminuser,
            Message: "Add Admin Successfully"
        });


    } catch (error) {
        res.status(400).json({
            success: false,
            Message: "admin not added successfully"
        });
    }
}

exports.adminlogin = async (req, res) => {
    try {
        const { email, password, googleId, githubId, userEmail, name } = req.body;

        let findUsers = {};


        if (email) {
            findUsers.email = email;
        } else if (googleId) {
            findUsers.googleId = googleId;
        } else if (githubId) {
            findUsers.githubId = githubId;
        }

        let finduser = await Admin.findOne(findUsers);
        let findemailuser = await Admin.findOne({ email: userEmail });


        if (findemailuser) {
            findemailuser.userName = findemailuser.userName ? findemailuser.userName : name;

            if (googleId) {
                findemailuser.googleId = findemailuser.googleId || googleId;
            } else if (githubId) {
                findemailuser.githubId = findemailuser.githubId || githubId;
            }

            findemailuser.email = userEmail;

            await findemailuser.save();

            if (googleId) {
                findemailuser.googleId = googleId;
            } else if (githubId) {
                findemailuser.githubId = githubId;
            }

            const payload = {
                id: findemailuser.id,
                email: findemailuser.email
            };

            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "24h"
            });

            return res.status(200).json({
                success: true,
                data: { user: finduser, token: token },
                message: "User login successfully"
            });
        }

        if (!finduser) {
            // console.log(123);
            finduser = new User();
            finduser.userName = name;

            if (googleId) {
                finduser.googleId = googleId;
            } else if (githubId) {
                finduser.githubId = githubId;
            }

            finduser.email = userEmail;

            await finduser.save();


            if (googleId) {
                finduser.googleId = googleId;
            } else if (githubId) {
                finduser.githubId = githubId;
            }

            return res.status(200).json({
                success: true,
                message: "User login successfully"
            });
        }
        if (!finduser) {
            const error = new Error("user not user")
            error.statusCode = 422
            throw error
        }

        if (email && password) {
            const validpw = await bcrypt.compare(password, finduser.password);

            if (!validpw) {
                throw new Error("Invalid email or password");
            }
        }

        const payload = {
            id: finduser.id,
            email: finduser.email
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "24h"
        });

        finduser.login_token = token;
        await finduser.save();

        res.status(200).json({
            success: true,
            data: { user: finduser, token: token },
            message: "User login successfully"
        });
    } catch (error) {
        res.status(400).json
            ({
                success: false,
                message: error.message
            });
    }
};

exports.userdatadget = async (req, res) => {
    try {
        const limitValue = req.query.limit;
        let pageValue = req.query.page;
        const skipValue = limitValue * pageValue;
        const user = await User.find().limit(limitValue).skip(skipValue);

        const totaluser = await User.count();


        res.status(200).json({
            success: true,
            data: { user: user, count: totaluser },
            Message: "All Admin Get Successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            Message: error.Message
        });
    }
}

exports.userstatusupadate = async (req, res) => {
    try {

        const id = req.query.id;
        const user = await User.findOne({_id:id});

        user.status = !user.status;
         
         await user.save();

        res.status(200).json({
            success: true,
            data: user,
            Message: "User Status Updated Successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            Message: error.Message
        });
    }
}


exports.viewuser = async (req,res) => {
    try {
        const id = req.query.id;
        
        const finduser = await User.findOne({_id:id});


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
}

exports.allpost = async (req,res) => {
    try {   
        const limitValue = req.query.limit;
        let pageValue = req.query.page;
        const skipValue = limitValue * pageValue;
        
        const findpost = await Post.find().limit(limitValue).skip(skipValue);

        const totalpost = await Post.count();


        res.status(200).json({
            success: true,
            data: { post: findpost, count: totalpost },
            message: "User get Successfully"
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

exports.viewpost = async (req,res) => {
    try {
        const id = req.query.id;
        
        const findpost = await Post.findOne({_id:id});


        res.status(200).json({
            success: true,
            data: findpost,
            message: "post get Successfully"
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

exports.poststatusupadate = async (req, res) => {
    try {

        const id = req.query.id;
        const {status} = req.body
        const post = await Post.findById(id);

        if(status == 0){
            post.status = "Pending";
        }else if(status == 1){
            post.status = "Approved";
        }else if(status == 2){
            post.status = "Rejected";
        }

         await post.save();

        res.status(200).json({
            success: true,
            data: post,
            Message: "post Status Updated Successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            Message: error.Message
        });
    }
    }
