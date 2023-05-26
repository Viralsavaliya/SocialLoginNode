const express = require('express');
const router = express.Router();
const commentcontroller = require('../controller/commentController')

const {authorize} = require('../midddleware/aurthorize')

router.get('/', authorize,commentcontroller.getallcomment)
router.post('/', authorize,commentcontroller.addcomment)
router.delete('/', authorize,commentcontroller.deletecomment)

module.exports = router