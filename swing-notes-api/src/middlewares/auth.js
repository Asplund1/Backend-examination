// Verifierar JWT-token för skyddade endpoints
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Hämtar headern Authorization
  const authHeader = req.headers['authorization'];
  // Förväntar Bearer token
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token saknas' });
  // Verifierar token med hemlighet
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Ogiltig token' });
    // Sparar payload i req.user
    req.user = user; // user innehåller t.ex. { id, username }
    next();
  });
}

module.exports = authenticateToken;
