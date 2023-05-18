const express = require('express');
const router = express.Router();
const usercontroller =require('../controller/userController')
const auth = require('./auth')

const multer = require('multer');
const path = require('path');
const {authorize} = require('../midddleware/aurthorize')
// router.use('/', express.static(path.join(__dirname, '/uploads')));

router.get('/',usercontroller.getalluser)
router.get('/profile',authorize,usercontroller.getoneuser)
router.put('/update-profile',authorize,usercontroller.updateprofile)
router.post('/upload-image',authorize,usercontroller.uploadimage)




router.use('/auth',auth)

module.exports = router;

