const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');

router.post('/:type', verifyToken, upload.single('image'), uploadImage);

module.exports = router;