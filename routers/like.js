const express = require('express');
const router = express.Router();
const likecontroller = require('../controller/likeController')

const {authorize} = require('../midddleware/aurthorize')

router.get('/', authorize,likecontroller.getalllike)
router.post('/', authorize,likecontroller.addlike)
router.delete('/', authorize,likecontroller.deletelike)



module.exports = router