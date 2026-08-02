const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { syncUser } = require('../controllers/authController');

router.post('/sync', verifyFirebaseToken, syncUser);

module.exports = router;