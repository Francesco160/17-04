const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Ottieni il token dal header
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  // Verifica il token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token non valido' });
    }
    req.user = user;  // Aggiungi i dati dell'utente nella request
    next();
  });
}

module.exports = authenticateToken;
