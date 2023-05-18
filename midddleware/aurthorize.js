const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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

        const user = await User.findById(id).lean()

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