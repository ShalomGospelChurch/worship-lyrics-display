// routes/auth.js
const express = require('express');
const router = express.Router();
const { loadUsers, comparePassword } = require('../utils/users');

// Middleware per autenticazione
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    // Se è una richiesta API, restituisci JSON
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Non autenticato' });
    }
    // Altrimenti, redirect al login
    return res.redirect('/login');
  }
}

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users[username];
  
  if (!user || !comparePassword(password, user.password)) {
    return res.status(401).json({ message: 'Credenziali non valide' });
  }

  req.session.userId = username;
  req.session.name = user.name;

  console.log(`✓ Login: ${user.name} (${username})`);
  res.json({ success: true });
});

// Logout
router.post('/logout', requireAuth, (req, res) => {
  const username = req.session.userId;
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Errore durante il logout' });
    console.log(`✓ Logout: ${username}`);
    res.json({ success: true });
  });
});

module.exports = { router, requireAuth };