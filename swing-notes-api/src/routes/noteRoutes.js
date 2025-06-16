const express = require('express');
const router  = express.Router();
const authenticateToken = require('../middlewares/auth');
const {getNotes,createNote,updateNote,deleteNote,searchNotes,} = require('../controllers/noteController');

// Alla endpoints efter den här kräver att man är inloggad
router.use(authenticateToken);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Hämta alla anteckningar för inloggad användare
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista med anteckningar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Ingen giltig token
 *       500:
 *         description: Interna serverfel
 */
router.get('/', getNotes);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Skapar en ny anteckning
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 50
 *               text:
 *                 type: string
 *                 maxLength: 300
 *     responses:
 *       201:
 *         description: Anteckning skapad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Felaktig input
 *       401:
 *         description: Ingen giltig token
 *       500:
 *         description: Interna serverfel
 */
router.post('/', createNote);

/**
 * @swagger
 * /api/notes:
 *   put:
 *     summary: Uppdaterar en befintlig anteckning
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *                 maxLength: 50
 *               text:
 *                 type: string
 *                 maxLength: 300
 *     responses:
 *       200:
 *         description: Anteckning uppdaterad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Felaktig input
 *       401:
 *         description: Ingen giltig token
 *       403:
 *         description: Ingen åtkomst till anteckningen
 *       404:
 *         description: Anteckning ej hittad
 *       500:
 *         description: Interna serverfel
 */
router.put('/', updateNote);

/**
 * @swagger
 * /api/notes:
 *   delete:
 *     summary: Tar bort en anteckning
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Anteckning borttagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Anteckning borttagen
 *       400:
 *         description: Felaktig input
 *       401:
 *         description: Ingen giltig token
 *       403:
 *         description: Ingen åtkomst till anteckningen
 *       404:
 *         description: Anteckning ej hittad
 *       500:
 *         description: Interna serverfel
 */
router.delete('/', deleteNote);

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Söker bland anteckningar på titel
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Söksträng för titel
 *     responses:
 *       200:
 *         description: Lista med träffar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       400:
 *         description: Saknar söksträng
 *       401:
 *         description: Ingen giltig token
 *       500:
 *         description: Interna serverfel
 */
router.get('/search', searchNotes);

module.exports = router;
