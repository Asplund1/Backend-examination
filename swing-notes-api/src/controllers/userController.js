const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username och lösenord krävs' });
    }

    // Kolla om username finns
    const userExists = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Användare finns redan' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, passwordHash]
    );

    const newUser = result.rows[0];
    // Vid signup kan man välja att returnera användarinfo utan token,
    // eller direkt skapa token och returnera. Här returnerar vi bara info.
    res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username och lösenord krävs' });
    }

    const userResult = await db.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Användare hittades ej' });
    }
    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Felaktigt lösenord' });
    }

    // Skapa JWT-token
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
