const express = require('express');
const router =express.Router();
const admincontroller = require('../../controller/adminController')
const {authorize} = require('../../midddleware/aurthorize')

router.get('/',authorize,admincontroller.getalladmin)
router.post('/adminregister',admincontroller.adminregister)
router.post('/adminlogin',admincontroller.adminlogin)
router.get('/userget', authorize, admincontroller.userdatadget)


module.exports = router;