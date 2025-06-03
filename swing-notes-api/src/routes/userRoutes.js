const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');


/**
 * POST /api/user/signup
 * - Skapar ett nytt konto.  
 * - Controller-funktion: signup(req, res, next).
 */
router.post('/signup', signup);

/**
 * POST /api/user/login
 * - Loggar in en användare.  
 * - Controller-funktion: login(req, res, next).
 */
router.post('/login', login);

module.exports = router;
