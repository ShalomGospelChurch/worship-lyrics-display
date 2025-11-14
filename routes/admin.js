// routes/admin.js
const express = require('express');
const router = express.Router();
const { loadUsers, saveUsers, hashPassword } = require('../utils/users');
const { requireAuth } = require('./auth');

// Middleware admin
function requireAdmin(req, res, next) {
  if (req.session.role === 'admin') next();
  else res.status(403).json({ message: 'Non sei autorizzato' });
}

// Get all users
router.get('/users', requireAuth, requireAdmin, (req, res) => {
  const users = loadUsers();
  // Remove passwords from response
  const usersWithoutPasswords = {};
  Object.entries(users).forEach(([username, user]) => {
    usersWithoutPasswords[username] = {
      name: user.name,
      role: user.role
    };
  });
  res.json(usersWithoutPasswords);
});

// Create new user
router.post('/users', requireAuth, requireAdmin, (req, res) => {
  const { username, name, role, password } = req.body;
  
  if (!username || !name || !role) {
    return res.status(400).json({ message: 'Username, nome e ruolo sono obbligatori' });
  }
  
  const users = loadUsers();
  
  if (users[username]) {
    return res.status(400).json({ message: 'Username già esistente' });
  }
  
  users[username] = {
    name,
    role,
    password: hashPassword(password || 'password123')
  };
  
  saveUsers(users);
  console.log(`✓ Utente creato: ${username} (${name}) - Ruolo: ${role}`);
  
  res.json({ success: true, message: `Utente ${username} creato con successo` });
});

// Update user
router.put('/users/:username', requireAuth, requireAdmin, (req, res) => {
  const { username } = req.params;
  const { name, role, password } = req.body;
  
  const users = loadUsers();
  const user = users[username];
  
  if (!user) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }
  
  if (name) user.name = name;
  if (role) user.role = role;
  if (password) user.password = hashPassword(password);
  
  saveUsers(users);
  console.log(`✓ Utente aggiornato: ${username}`);
  
  res.json({ success: true, message: `Utente ${username} aggiornato` });
});

// Delete user
router.delete('/users/:username', requireAuth, requireAdmin, (req, res) => {
  const { username } = req.params;
  
  // Prevent deleting yourself
  if (username === req.session.userId) {
    return res.status(400).json({ message: 'Non puoi eliminare il tuo account' });
  }
  
  const users = loadUsers();
  
  if (!users[username]) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }
  
  delete users[username];
  saveUsers(users);
  console.log(`✓ Utente eliminato: ${username}`);
  
  res.json({ success: true, message: `Utente ${username} eliminato` });
});

// Reset password di un utente
router.post('/reset-password', requireAuth, requireAdmin, (req, res) => {
  const { username, newPassword } = req.body;
  const users = loadUsers();
  const user = users[username];
  
  if (!user) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }

  user.password = hashPassword(newPassword || 'password123');
  saveUsers(users);
  console.log(`✓ Password resettata per: ${username}`);

  res.json({ success: true, message: `Password di ${username} resettata` });
});

module.exports = { router };