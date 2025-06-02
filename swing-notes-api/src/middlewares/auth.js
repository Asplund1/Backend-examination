const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Vi förväntar oss "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token saknas' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Ogiltig token' });
    req.user = user; // user innehåller t.ex. { id, username }
    next();
  });
}

module.exports = authenticateToken;
