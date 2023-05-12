const User = require('../models/userModel')

exports.getalluser = async (req,res) =>{
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
            message:error.message
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