const express = require('express');
const router = express.Router();
const usercontroller =require('../controller/userController')
const auth = require('./auth')
const post =require('./post')
const like =require('./like')
const comment = require('./comment')
const follow = require('./follow')
const message = require('./message')

const {authorize} = require('../midddleware/aurthorize')
// router.use('/', express.static(path.join(__dirname, '/uploads')));

router.get('/',authorize,usercontroller.getalluser)
router.get('/profile',authorize,usercontroller.getoneuser)
router.put('/update-profile',authorize,usercontroller.updateprofile)
router.post('/upload-image',authorize,usercontroller.uploadimage)





router.use('/auth',auth)
router.use('/post',post)
router.use('/like',like)
router.use('/comment', comment)
router.use('/follow', follow)
router.use('/message', message)

module.exports = router;

