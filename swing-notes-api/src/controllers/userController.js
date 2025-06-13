//src/controllers/userController.js
// Hanterar registrering och inloggning av användare
const db = require('../utils/databas');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registreringsfunktion
const signup = async (req, res, next) => {
  try {
    // Hämtar användarnamn och lösenord från request-body
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username och lösenord krävs' });
    }

    // Kollar om användarnamnet redan finns
    const userExists = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Användare finns redan' });
    }

    // Genererar salt och gör hash av lösenordet
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Sparar ny användare i databasen
    const result = await db.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, passwordHash]
    );
    // Hämtar tillbaka skapad användare
    const newUser = result.rows[0];
    res.status(201).json({ user: newUser });
  } catch (err) {
    // Skickar vidare fel till global felhanterare
    next(err);
  }
};


// Inloggningsfunktion
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username och lösenord krävs' });
    }

    // Hämtar användare från databasen
    const userResult = await db.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Användare hittades ej' });
    }
    const user = userResult.rows[0];
    // Jämför skickat lösenord med hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Felaktigt lösenord' });
    }

    // Skapa JWT-token
    const payload = { id: user.id, username: user.username };
    // Signerar token med hemlig nyckel och expire tid
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    // Returnerar token till klient
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
