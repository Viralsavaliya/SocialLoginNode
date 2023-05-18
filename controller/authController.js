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

// exports.login = async (req, res) => {
//     try {

//         const { email, password, googleId, facebookId, githubId, twitterId , userEmail, name } = req.body



//         let findUsers;

//         if (email) {
//             findUsers = { email: email }
//         } else if (googleId) {
//             findUsers = { googleId: googleId }
//         } else if (facebookId) {
//             findUsers = { facebookId: facebookId }
//         } else if (githubId) {
//             findUsers = { githubId: githubId }
//         } else if (twitterId) {
//             findUsers = { twitterId: twitterId }
//         }

//         let finduser = await User.find(findUsers);
//         let findemailuser = await User.findOne({email:userEmail}); 


//         if(findemailuser){
//             if (googleId) {
//                 console.log(123);
//                 findemailuser.userName = name;
//                 findemailuser.googleId = findemailuser.googleId ? findemailuser.googleId :googleId ;               
//                 findemailuser.facebookId = findemailuser.facebookId ? findemailuser.facebookId : facebookId ;               
//                 findemailuser.githubId = findemailuser.githubId ? findemailuser.githubId: githubId;
//                 findemailuser.twitterId = findemailuser.twitterId ? findemailuser.twitterId: twitterId;
//                 findemailuser.email = userEmail;

//                 await findemailuser.save();
//                 findemailuser.googleId = googleId;
//               return  res.status(200).json({
//                     success: true,
//                     message: "User login successfully"
//                 })
//             }else if (facebookId) {
//                 console.log(123);
//                 findemailuser.userName = name;
//                 findemailuser.googleId ? googleId : null ;              
//                 findemailuser.facebookId ? facebookId : null ;             
//                 findemailuser.githubId ? githubId: null;
//                 findemailuser.twitterId ? twitterId: null;
//                 findemailuser.email = userEmail;

//                 await findemailuser.save();
//                 findemailuser.facebookId = facebookId;
//                 return   res.status(200).json({
//                     success: true,
//                     message: "User login successfully"
//                 })
//             }
//             else if (githubId) {
//                 console.log(123);
//                 findemailuser.userName = name;
//                 findemailuser.googleId = findemailuser.googleId ? findemailuser.googleId :googleId ;               
//                 findemailuser.facebookId = findemailuser.facebookId ? findemailuser.facebookId : facebookId ;               
//                 findemailuser.githubId = findemailuser.githubId ? findemailuser.githubId: githubId;
//                 findemailuser.twitterId = findemailuser.twitterId ? findemailuser.twitterId: twitterId;
//                 findemailuser.email = userEmail;

//                    await findemailuser.save();
//                    findemailuser.githubId = githubId;
//                    return   res.status(200).json({
//                     success: true,
//                     message: "User login successfully"
//                 })

//             }
//             else if (twitterId) {
//                 console.log(123);
//                 findemailuser.userName = name;
//                 findemailuser.googleId ? googleId : null ;               
//                 findemailuser.facebookId ? facebookId : null ;               
//                 findemailuser.githubId ? githubId: null;
//                 findemailuser.twitterId ? twitterId: null;
//                 findemailuser.email = userEmail;

//                   await findemailuser.save();
//                 findemailuser.twitterId = twitterId;
//                 return  res.status(200).json({
//                     success: true,
//                     message: "User login successfully"
//                 })
//             }

//         }


//         if (!finduser) {
//             if (googleId) {
//                 console.log(123);
//                 finduser = new User();
//                 finduser.userName = name;
//                 finduser.googleId = googleId;
//                 finduser.email = userEmail;

//                 await finduser.save();
//                 finduser.googleId = googleId;
//                 return   res.status(200).json({
//                     success: true,
//                     message: "User login successfully"
//                 })
//             }
//             else if (facebookId) {
//                 console.log(123);
//                 finduser = new User();
//                 finduser.userName = name;
//                 finduser.facebookId = facebookId;
//                 finduser.email = userEmail;

//                    await finduser.save();
//                 finduser.facebookId = facebookId;
//                 return  res.status(200).json({
//                     success: true,
//                     message: "User login successfully"
//                 })
//             }
//             else if (githubId) {
//                 console.log(123);
//                 finduser = new User();
//                 finduser.userName = name;
//                 finduser.githubId = githubId;
//                 finduser.email = userEmail;

//                    await finduser.save();
//                 finduser.githubId = githubId;
//                 return    res.status(200).json({
//                     success: true,
//                     message: "User login successfully"
//                 })
//             }
//             else if (twitterId) {
//                 console.log(123);
//                 finduser = new User();
//                 finduser.userName = name;
//                 finduser.twitterId = twitterId;
//                 finduser.email = userEmail;

//                 await finduser.save();
//                 finduser.twitterId = twitterId;
//                 return   res.status(200).json({
//                     success: true,
//                     message: "User login successfully"
//                 })
//             }
//         }

//         if (!finduser) {
//             const error = new error('Invalid email Or password');
//             error.statuscode = 404;
//             throw error
//         }


//         if (email && password) {

//             const validpw = await bcrypt.compare(password, finduser.password)

//             if (!validpw) {
//                 const error = new error('Invalid email Or password');
//                 error.statuscode = 404;
//                 throw error
//             }
//         }

//         const payload = {
//             id: finduser.id,
//             email: finduser.email
//         }

//         const token = jwt.sign(payload, process.env.SECRET_KEY, {
//             expiresIn: '24h'
//         })

//         finduser.login_token = token

//         await finduser.save()



//         res.status(200).json({
//             success: true,
//             data: token,
//             message: "User login successfully"
//         })


//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

exports.login = async (req, res) => {
    try {
        const { email, password, googleId, facebookId, githubId, twitterId, userEmail, name } = req.body;

        let findUsers = {};

        if (email) {
            findUsers.email = email;
        } else if (googleId) {
            findUsers.googleId = googleId;
        } else if (facebookId) {
            findUsers.facebookId = facebookId;
        } else if (githubId) {
            findUsers.githubId = githubId;
        } else if (twitterId) {
            findUsers.twitterId = twitterId;
        }

        let finduser = await User.findOne(findUsers);
        let findemailuser = await User.findOne({ email: userEmail });

        if (findemailuser) {
            findemailuser.userName = name;

            if (googleId) {
                findemailuser.googleId = findemailuser.googleId || googleId;
            } else if (facebookId) {
                findemailuser.facebookId = findemailuser.facebookId || facebookId;
            } else if (githubId) {
                findemailuser.githubId = findemailuser.githubId || githubId;
            } else if (twitterId) {
                findemailuser.twitterId = findemailuser.twitterId || twitterId;
            }

            findemailuser.email = userEmail;

            await findemailuser.save();

            if (googleId) {
                findemailuser.googleId = googleId;
            } else if (facebookId) {
                findemailuser.facebookId = facebookId;
            } else if (githubId) {
                findemailuser.githubId = githubId;
            } else if (twitterId) {
                findemailuser.twitterId = twitterId;
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
                data:token,
                message: "User login successfully"
            });
        }

        if (!finduser) {
            console.log(123);
            finduser = new User();
            finduser.userName = name;

            if (googleId) {
                finduser.googleId = googleId;
            } else if (facebookId) {
                finduser.facebookId = facebookId;
            } else if (githubId) {
                finduser.githubId = githubId;
            } else if (twitterId) {
                finduser.twitterId = twitterId;
            }

            finduser.email = userEmail;

            await finduser.save();

            if (googleId) {
                finduser.googleId = googleId;
            } else if (facebookId) {
                finduser.facebookId = facebookId;
            } else if (githubId) {
                finduser.githubId = githubId;
            } else if (twitterId) {
                finduser.twitterId = twitterId;
            }

            return res.status(200).json({
                success: true,
                message: "User login successfully"
            });
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
            data: token,
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




