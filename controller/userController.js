const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
        const id = req.headers;
        console.log(id)

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
        const id = req.headers;

        const finduser = await User.findById(id);

        if (!finduser) {
            const error = new error('Invalid email Or password');
            error.statuscode = 404;
            throw error
        }
        const hashpassword = await bcrypt.hash(req.body.password, 10)

        finduser.userName = req.body.userName;
        finduser.email = req.body.email;
        finduser.age = req.body.age;
        finduser.password = hashpassword;
        finduser.mobileNo = req.body.mobileNo;
        finduser.address = {
            type: 'Point',
            coordinates: [req.body.address.latitude, req.body.address.longitude],
          };
        finduser.gender = req.body.gender;

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