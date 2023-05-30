const express = require('express');
const router = express.Router();

const followcontroller = require('../controller/followController')

const {authorize} = require('../midddleware/aurthorize')

router.get('/',authorize,followcontroller.getallfollwer)
router.post('/',authorize,followcontroller.sendfollowrequest)
router.post('/acceptrequest',authorize,followcontroller.acceptrequestrequest)
router.post('/rejectrequest',authorize,followcontroller.rejectrequest)

router.get('/allrequestoneuser',authorize,followcontroller.getonealluserrequest)
router.get('/followuser',authorize,followcontroller.getallfollowuser)
router.get('/following',authorize,followcontroller.getoneuserallfollowing)



module.exports = router;

