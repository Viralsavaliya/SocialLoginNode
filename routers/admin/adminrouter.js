const express = require('express');
const router =express.Router();
const admincontroller = require('../../controller/adminController')
const {authorize} = require('../../midddleware/aurthorize')

router.get('/',authorize,admincontroller.getalladmin)
router.post('/adminregister',admincontroller.adminregister)
router.post('/adminlogin',admincontroller.adminlogin)
router.get('/userget', authorize, admincontroller.userdatadget)
router.post('/userstatusupadate',authorize,admincontroller.userstatusupadate)
router.get('/viewuser', authorize, admincontroller.viewuser)
router.get('/allpost', authorize, admincontroller.allpost)
router.get('/viewpost', authorize, admincontroller.viewpost)
router.post('/poststatusupadate',authorize,admincontroller.poststatusupadate)


module.exports = router;