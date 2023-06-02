const express = require('express');
const router = express.Router();

const messcontroller = require('../controller/messageController')

const {authorize} = require('../midddleware/aurthorize')

router.get('/',authorize,messcontroller.getallmeasage)
router.get("/chatpage", authorize, messcontroller.chatPage);


module.exports = router;

