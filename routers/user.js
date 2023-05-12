const express = require('express');
const router = express.Router();
const usercontroller =require('../controller/userController')
const auth = require('./auth')

router.get('/',usercontroller.getalluser)



router.use('/auth',auth)

module.exports = router;

