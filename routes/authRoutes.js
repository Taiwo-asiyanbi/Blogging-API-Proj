const express = require('express');
const router = express.Router();

const { signup, signin } = require('../controllers/authController');
const { validateSignup, validateSignin, handleValidationErrors } = require('../middleware/validation');

router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/signin', validateSignin, handleValidationErrors, signin);

module.exports = router;
