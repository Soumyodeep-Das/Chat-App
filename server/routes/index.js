const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logOut = require('../controller/logout');

const router = express.Router();

// Create user API
router.post('/register', registerUser);
//check user email
router.post('/email', checkEmail);
//check password
router.post('/password', checkPassword);
//login user detais
router.get('/user-details', userDetails);
//logout user
router.get('/logout', logOut);

module.exports = router;
