const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'backstage_super_secret_key';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'no token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = { authMiddleware, JWT_SECRET };
