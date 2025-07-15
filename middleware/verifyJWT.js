const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' });

const SECRET = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token required'
    });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token'
      });
    }

    req.user = user;
    console.log('user:', user);
    next();
  });
};

module.exports = verifyJWT;
