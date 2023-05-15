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
        
        const { email, password, googleId,facebookId,githubId, userEmail ,name} = req.body



        let findUsers;

        if (email) {
            findUsers = { email: email }
        } else if (googleId) {
            findUsers = { googleId: googleId} 
        } else if (facebookId) {
            findUsers = { facebookId: facebookId} 
        }
        else if (githubId) {
            findUsers = { githubId: githubId} 
        }
    


        


        let finduser = await User.findOne(findUsers);


        if (!finduser) {
            if (googleId) {
                console.log(123);
                finduser = new User();
                finduser.userName = name;
                finduser.googleId = googleId;
                finduser.email = userEmail;
        
              await finduser.save();

               finduser.googleId = googleId;
            }
           else if (facebookId) {
                console.log(123);
                finduser = new User();
                finduser.userName = name;
                finduser.facebookId = facebookId;
                finduser.email = userEmail;
        
              await finduser.save();

                finduser.facebookId = facebookId;
            }
           else if (githubId) {
                console.log(123);
                finduser = new User();
                finduser.userName = name;
                finduser.githubId = githubId;
                finduser.email = userEmail;
        
              await finduser.save();

               finduser.githubId = githubId;
            }
        }

        if (!finduser) {
            const error = new error('Invalid email Or password');
            error.statuscode = 404;
            throw error
        }


        if (email && password) {
            
            const validpw = await bcrypt.compare(password, finduser.password)
    
            if (!validpw) {
                const error = new error('Invalid email Or password');
                error.statuscode = 404;
                throw error
            }
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
        res.status(400).json({
            success: false,
            message:error.message
        })
    }
}


