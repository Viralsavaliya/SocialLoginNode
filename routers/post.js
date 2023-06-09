const express = require('express');
const router = express.Router();

const postcontroller = require('../controller/postController')

const {authorize} = require('../midddleware/aurthorize')

router.get('/',authorize,postcontroller.getallpost)
router.post('/',authorize,postcontroller.addpost)
router.put('/:id',authorize,postcontroller.updatepost)
router.get('/oneuserpost',authorize,postcontroller.oneuserpost)
router.delete('/:id',authorize,postcontroller.deletepost)




module.exports = router;


