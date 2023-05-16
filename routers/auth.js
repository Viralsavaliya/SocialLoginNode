const express = require('express');
const router = express.Router();

const authcontroller = require('../controller/authController')

router.post('/register', authcontroller.register);
router.post('/login', authcontroller.login);
router.put('/password',authcontroller.socialloginpassword)



module.exports = router;

 