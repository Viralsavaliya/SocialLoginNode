const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Notification = require('../models/notification')



exports.register = async (req, res) => {
    try {
        const { userName, email, password, age } = req.body

        const finduser = await User.findOne({ email, status: false });

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
        const { email, password, googleId, githubId, userEmail, name } = req.body;

        let findUsers = {};

        if (email) {
            findUsers.email = email;
        } else if (googleId) {
            findUsers.googleId = googleId;
        } else if (githubId) {
            findUsers.githubId = githubId;
        }

        let finduser = await User.findOne({ email: findUsers.email, deletedstatus: true });
        let findemailuser = await User.findOne({ email: userEmail, deletedstatus: true });

        if (finduser) {
            if (finduser.status === false) {
                throw new Error('User activity is disabled');
            }
        }

        if (!finduser) {
            const error = new Error('User not found');
            error.statusCode = 422;
            throw error;
        }

        if (findemailuser) {
            if (findemailuser.status === false) {
                throw new Error('User activity is disabled');
            }

            // Update existing user with the provided name and authentication IDs
            findemailuser.userName = findemailuser.userName ? findemailuser.userName : name;

            if (googleId) {
                findemailuser.googleId = findemailuser.googleId || googleId;
            } else if (githubId) {
                findemailuser.githubId = findemailuser.githubId || githubId;
            }

            findemailuser.email = userEmail;

            await findemailuser.save();

            const payload = {
                id: findemailuser.id,
                email: findemailuser.email
            };

            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: '24h'
            });

            return res.status(200).json({
                success: true,
                data: { user: finduser, token: token },
                message: 'User login successfully'
            });
        }

        if (finduser.deletedstatus === false) {
            throw new Error('Your account has been deleted');
        }

        if (!finduser) {
            finduser = new User();
            finduser.userName = name;

            if (googleId) {
                finduser.googleId = googleId;
            } else if (githubId) {
                finduser.githubId = githubId;
            }

            finduser.email = userEmail;

            await finduser.save();

            return res.status(200).json({
                success: true,
                message: 'User login successfully'
            });
        }

        if (email && password) {
            const validpw = await bcrypt.compare(password, finduser.password);

            if (!validpw) {
                throw new Error('Invalid email or password');
            }
        }

        const payload = {
            id: finduser.id,
            email: finduser.email
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '24h'
        });

        finduser.login_token = token;
        await finduser.save();

        res.status(200).json({
            success: true,
            data: { user: finduser, token: token },
            message: 'User login successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


exports.socialloginpassword = async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const splitAuthorization = authorization.split(' ');

        const token = splitAuthorization[1];

        const decode = await jwt.verify(token, process.env.SECRET_KEY)
        const { email } = decode

        const { password, oldpassword } = req.body
        const finduser = await User.findOne({ email: email })

        if (oldpassword) {
            const confirmpw = await bcrypt.compare(oldpassword, finduser.password);
            if (!confirmpw) {
                throw new Error("password mismatch");
            }
        }


        const hashpw = await bcrypt.hash(password, 10)
        finduser.password = hashpw;

        await finduser.save();

        return res.status(200).json({
            success: true,
            data: finduser,
            message: "password update successfully"
        })
    } catch (error) {
        return res.status(422).json({
            success: false,
            message: error.message
        })
    }
}

const Emailuser = process.env.EMAIL_USER
const Emailpassword = process.env.EMAIL_PASSWORD

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    Port: 465,
    secure: false,
    auth: {
        user: Emailuser,
        pass: Emailpassword
    }
})

exports.sendEmail = async (req, res) => {
    let email;
    email = req.body.email;


    if (!email) {
        const authorization = req.headers['authorization'];
        const splitAuthorization = authorization.split(' ');
        const tokena = splitAuthorization[1];
        const decode = await jwt.verify(tokena, process.env.SECRET_KEY)
        email = decode.email
    }



    const user = await User.findOne({ email: email, deletedstatus: true });

    if (!user) {
        res.status(200).json({
            success: false,
            message: "user not found"
        })
    }

    // const userid = user.id

    // const payload = {
    //     id: userid
    // }

    // const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "5m" })

    const otpas = Math.floor(Math.random() * 1000000);;
    const userid = user?.id

    const payload = {
        id: userid
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "5m" })




    let info = await transporter.sendMail({
        from: `"node" <${Emailuser}>`,
        to: email,
        subject: "welcome to message",
        text: "hello  your password forgot",
        html: `OTP:- ${otpas}`

    })



    user.otp = otpas;
    await user.save();

    return res.status(200).json({
        success: true,
        data: token,
        message: "your mail successfully"
    })


}

exports.verificationotp = async (req, res) => {
    try {
        const { data } = req.query
        const authorization = req.headers['authorization'];
        const splitAuthorization = authorization.split(' ');
        const token = splitAuthorization[1];
        const decode = await jwt.verify(token, process.env.SECRET_KEY)
        const { id } = decode
        const user = await User.findById(id);

        const { otp } = req.body;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        const userotp = user.otp

        if (otp !== userotp) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }

        user.otp = null;
        if (data === "Profile") {
            user.deletedstatus = false;
        }
        await user.save();


        return res.status(200).json({
            success: true,
            message: "OTP verification successful",
        });


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

exports.resetpassword = async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const splitAuthorization = authorization.split(' ');
        const token = splitAuthorization[1];
        const decode = await jwt.verify(token, process.env.SECRET_KEY)
        const { id } = decode
        const user = await User.findById(id);

        const { password } = req.body;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        // const userpassword = user.password
        const hashpw = await bcrypt.hash(password, 10)
        user.password = hashpw;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Reset successful",
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}


const admin = require('firebase-admin');
const serviceAccount = require('../new-project-386405-firebase-adminsdk-m4xmr-f7e4dc86d0.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const messaging = admin.messaging();

exports.sendNotification = async (req, res) => {
    const { message, senderId, receiverId } = req.body;

    const newnotification = {
        message, 
        senderId, 
        receiverId 
    }
    // const message = {
    //     token: token,
    //     notification: {
    //         title,
    //         body,
    //     },
    // };

    try {
        const response = await Notification.create(newnotification);
        console.log('Notification sent successfully:', response);
        res.status(200).json({
            success:true,
            data: response,
            message: "Notification Sent Successfully"
        })
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
}



























































































// exports.sendNotificationA =  async (req,res) {

//     let message = {
//         data: data,
//         token: fcmReceiver?.token
//     }

//     try {
//         await this.admin.messaging().send(message).then((value) => {
//             console.log('Successfully sent message:', value);
//         }).catch((error) => {
//             console.log('Error sending message:', error?.errorInfo);
//             throw error
//         })
//     } catch (e) {
//         console.log('Error sending message:', e.message);
//     }
// }




