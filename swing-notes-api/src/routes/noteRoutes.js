const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
} = require('../controllers/noteController');

// Alla endpoints efter den här kräver att man är inloggad
router.use(authenticateToken);

router.get('/', getNotes);           // GET /api/notes
router.post('/', createNote);        // POST /api/notes
router.put('/', updateNote);         // PUT /api/notes
router.delete('/', deleteNote);      // DELETE /api/notes

// Sök-endpoint (VG-krav)
router.get('/search', searchNotes);  // GET /api/notes/search?q=<titel>

module.exports = router;
