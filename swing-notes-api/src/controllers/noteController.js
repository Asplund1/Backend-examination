//src/controllers/noteController.js
// Hanterar CRUD- och sök-operationer för anteckningar
const db = require('../utils/databas');

// Hämta alla anteckningar för inloggad användare
const getNotes = async (req, res, next) => {
  try {
    // Hämtar användar-ID från JWT-middleware
    const userId = req.user.id;
    // Kör parametriserad SQL-fråga
    const result = await db.query(
      'SELECT id, title, text, created_at AS "createdAt", modified_at AS "modifiedAt" FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    // Returnerar anteckningar som JSON
    res.json({ notes: result.rows });
  } catch (err) {
    next(err);
  }
};

// POST: Skapa en ny anteckning
const createNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, text } = req.body;
    if (!title || title.length > 50) {
      return res.status(400).json({ error: 'Title är obligatorisk (max 50 tecken)' });
    }
    if (text && text.length > 300) {
      return res.status(400).json({ error: 'Text får max vara 300 tecken' });
    }
    // Kör INSERT-fråga och returnerar skapat objekt
    const result = await db.query(
      `INSERT INTO notes (title, text, user_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, text, created_at AS "createdAt", modified_at AS "modifiedAt"`,
      [title, text || '', userId]
    );
    res.status(201).json({ note: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Uppdatera en befintlig anteckning
const updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, title, text } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Id krävs för att uppdatera' });
    }
    if (title && title.length > 50) {
      return res.status(400).json({ error: 'Title får max vara 50 tecken' });
    }
    if (text && text.length > 300) {
      return res.status(400).json({ error: 'Text får max vara 300 tecken' });
    }
    // Kontrollera att anteckningen finns och tillhör användaren
    const noteRes = await db.query('SELECT user_id FROM notes WHERE id = $1', [id]);
    if (noteRes.rows.length === 0) {
      return res.status(404).json({ error: 'Anteckning ej hittad' });
    }
    if (noteRes.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Ingen åtkomst till denna anteckning' });
    }
    // Uppdatera valda fält med COALESCE för partial update
    const result = await db.query(
      `UPDATE notes
       SET title = COALESCE($1, title),
           text = COALESCE($2, text),
           modified_at = NOW()
       WHERE id = $3
       RETURNING id, title, text, created_at AS "createdAt", modified_at AS "modifiedAt"`,
      [title, text, id]
    );
    res.json({ note: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Ta bort en anteckning
const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Id krävs för att ta bort' });
    }
    // Kontrollera existens och ägarskap
    const noteRes = await db.query('SELECT user_id FROM notes WHERE id = $1', [id]);
    if (noteRes.rows.length === 0) {
      return res.status(404).json({ error: 'Anteckning ej hittad' });
    }
    if (noteRes.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Ingen åtkomst till denna anteckning' });
    }
    await db.query('DELETE FROM notes WHERE id = $1', [id]);
    res.json({ message: 'Anteckning borttagen' });
  } catch (err) {
    next(err);
  }
};

// Sök anteckningar på titel
const searchNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Söksträng saknas' });
    }
    //använd ILIKE för case-insensitive sökning i titel
    const result = await db.query(
      `SELECT id, title, text, created_at AS "createdAt", modified_at AS "modifiedAt"
       FROM notes
       WHERE user_id = $1 AND title ILIKE $2
       ORDER BY created_at DESC`,
      [userId, `%${q}%`]
    );
    res.json({ notes: result.rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
};
