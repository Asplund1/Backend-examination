// src/routes/userRoutes.js
const express = require('express');
const router  = express.Router();
const { signup, login } = require('../controllers/userController');

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Skapar ett nytt användarkonto
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Konto skapat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Felaktig input eller användarnamnet upptaget
 *       500:
 *         description: Interna serverfel
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Loggar in en användare
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inloggning lyckad, returnerar token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Felaktig input eller felaktigt lösenord
 *       404:
 *         description: Användare ej hittad
 *       500:
 *         description: Interna serverfel
 */
router.post('/login', login);

module.exports = router;
