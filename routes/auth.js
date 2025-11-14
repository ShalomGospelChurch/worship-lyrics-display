// routes/auth.js
const express = require('express');
const router = express.Router();
const { loadUsers, saveUsers, hashPassword, comparePassword } = require('../utils/users');

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
  req.session.role = user.role;
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

// Cambio password (utente loggato)
router.post('/change-password', requireAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const users = loadUsers();
  const user = users[req.session.userId];

  if (!comparePassword(oldPassword, user.password)) {
    return res.status(401).json({ message: 'Password vecchia non corretta' });
  }

  user.password = hashPassword(newPassword);
  saveUsers(users);

  res.json({ success: true, message: 'Password aggiornata' });
});

// Check if user is admin (per Easter Egg)
router.get('/check-admin', requireAuth, (req, res) => {
  res.json({ 
    isAdmin: req.session.role === 'admin',
    username: req.session.userId,
    role: req.session.role,
    name: req.session.name
  });
});

module.exports = { router, requireAuth };