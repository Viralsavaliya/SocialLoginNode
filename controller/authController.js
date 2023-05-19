const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')




exports.register = async (req, res) => {
    try {
        const { userName, email, password, age } = req.body

        const finduser = await User.findOne({ email });

        if (finduser) {
            const error = new error('User alreasdy extis');
            error.statuscode = 404;
            throw error
        }


        const hashpw = await bcrypt.hash(password, 10)
        const newuser = {
            userName,
            email,
            password: hashpw,
            age
        }

        const finaluser = await User.create(newuser);

        res.status(200).json({
            success: true,
            data: finaluser,
            message: "User register successfully"
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "user already exists"
        })
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password, googleId, facebookId, githubId, twitterId, userEmail, name } = req.body;

        let findUsers = {};


        if (email) {
            findUsers.email = email;
        } else if (googleId) {
            findUsers.googleId = googleId;
        } else if (githubId) {
            findUsers.githubId = githubId;
        }

        let finduser = await User.findOne(findUsers);
        let findemailuser = await User.findOne({ email: userEmail });

       
        if (findemailuser) {
            findemailuser.userName =  findemailuser.userName ?  findemailuser.userName : name  ;

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
                data:{user:finduser,token:token},
                message: "User login successfully"
            });
        }
      
        if (!finduser) {
            console.log(123);
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
        if(!finduser)   {
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
            data: {user:finduser,token:token},
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

exports.socialloginpassword = async (req,res) =>{
    try {
        const authorization = req.headers['authorization'];
        const splitAuthorization = authorization.split(' ');

        const token = splitAuthorization[1];

        const decode = await jwt.verify(token, process.env.SECRET_KEY)
        const {email} = decode

        const {password} = req.body
        const finduser = await User.findOne({email:email})


        const hashpw = await bcrypt.hash(password, 10)
        finduser.password = hashpw;

        await finduser.save();

        return res.status(200).json({
            success:true,
            data:finduser,
            message:"password add successfully"
        })
    } catch (error) {
        return res.status(422).json({
            success:false,
            message:error.message
        })
    }
}




