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
    console.log('✅ users.json creato con utenti di default');
    console.log('⚠️  Cambia le password nel file .env!');
    return defaultUsers;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function createDefaultUsers() {
  // Usa password da .env se disponibili, altrimenti usa "password123"
  return {
    admin1: { 
      name: 'Admin 1', 
      role: 'admin', 
      password: hashPassword(process.env.ADMIN1_PASSWORD || 'password123')
    },
    admin2: { 
      name: 'Admin 2', 
      role: 'admin', 
      password: hashPassword(process.env.ADMIN2_PASSWORD || 'password123')
    },
    regia1: { 
      name: 'Regia 1', 
      role: 'regia', 
      password: hashPassword(process.env.REGIA1_PASSWORD || 'password123')
    },
    regia2: { 
      name: 'Regia 2', 
      role: 'regia', 
      password: hashPassword(process.env.REGIA2_PASSWORD || 'password123')
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