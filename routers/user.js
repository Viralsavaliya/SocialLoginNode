const express = require('express');
const router = express.Router();
const usercontroller =require('../controller/userController')
const auth = require('./auth')
const {authorize} = require('../midddleware/aurthorize')

router.get('/',usercontroller.getalluser)
router.get('/profile',authorize,usercontroller.getoneuser)
router.put('/update-profile',authorize,usercontroller.updateprofile)



router.use('/auth',auth)

module.exports = router;

