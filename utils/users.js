// utils/users.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const filePath = path.join(__dirname, '../users.json');

// Carica variabili d'ambiente se presente
require('dotenv').config();

function loadUsers() {
  if (!fs.existsSync(filePath)) {
    const defaultUsers = createDefaultUsers();
    saveUsers(defaultUsers);
    console.log('✅ users.json creato con utente di default');
    return defaultUsers;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function createDefaultUsers() {
  // Usa password da .env se disponibile, altrimenti usa "sgc2024"
  return {
    admin: { 
      name: 'SGC Regia', 
      password: hashPassword('admin')
    }
  };
}

function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = { loadUsers, saveUsers, hashPassword, comparePassword };