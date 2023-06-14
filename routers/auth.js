const express = require('express');
const router = express.Router();

const authcontroller = require('../controller/authController')

router.post('/register', authcontroller.register);
router.post('/login', authcontroller.login);
router.put('/password',authcontroller.socialloginpassword)
router.post('/forget-password', authcontroller.sendEmail)
router.post('/verificationotp', authcontroller.verificationotp)
router.post('/resetpassword', authcontroller.resetpassword)
router.post('/notifiction', authcontroller.sendNotification)



module.exports = router;

 