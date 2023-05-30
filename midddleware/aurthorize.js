const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');

exports.authorize = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];

        if (!authorization) {
            const error = new Error("Authorization not found")
            error.statusCode = 422
            throw error
        }

        const splitAuthorization = authorization.split(' ');

        const token = splitAuthorization[1];
        console.log(token);
        if (!token) {
            const error = new Error("Authorization token invalid")
            error.statusCode = 422
            throw error
        }
        let decode

        try {
            decode = await jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            const err = new Error('Authorization token invalid')
            err.statusCode = 422
            throw err
        }

        const { id } = decode       

        let user;
        console.log(req.baseUrl);
        if (req.baseUrl === '/api' || req.baseUrl === '/api/post' || req.baseUrl === '/api/like' ||req.baseUrl === '/api/comment' ||req.baseUrl === '/api/follow') {
            user = await User.findById(id);
        } else if (req.baseUrl === '/admin') {
            user = await Admin.findById(id);
        }   
        if (user === null) {
            const error = new Error("Authorization token invalid")
            error.statusCode = 422
            throw error
        }
        req.user = user
        // req.headers = id
        next();

    } catch (error) {
        const status = error.statusCode || 500
        return res.status(status).json({
            success: false,
            message: error.message
        })
    }
}