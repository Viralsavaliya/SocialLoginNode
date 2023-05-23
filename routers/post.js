const express = require('express');
const router = express.Router();

const postcontroller = require('../controller/postController')

const {authorize} = require('../midddleware/aurthorize')

router.get('/',authorize,postcontroller.getallpost)
router.post('/',authorize,postcontroller.addpost)




module.exports = router;


