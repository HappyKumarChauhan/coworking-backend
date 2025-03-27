const express = require('express');
const { loginWithFirebase} = require('../controllers/authController');

const router = express.Router();

// Google Authentication via Firebase
router.post('/firebase-login', loginWithFirebase);

module.exports = router;
