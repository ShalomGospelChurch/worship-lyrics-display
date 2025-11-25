const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const { router: authRoutes, requireAuth } = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'sgc-lyrics-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24*60*60*1000, httpOnly: true, secure: false }
}));
app.use(express.static(path.join(__dirname, 'views')));

// Rotte API
app.use('/api', authRoutes);

// Pagine pubbliche
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/control');
  }
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'display.html'));
});

app.get('/tablet', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'tablet.html'));
});

app.get('/display-rotated', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'display-rotated.html'));
});

// Pagine protette (richiedono login)
app.get('/control', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'control.html'));
});

// WebSocket per real-time communication
io.on('connection', socket => {
  console.log('✓ Client connesso:', socket.id);
  
  socket.on('invia-testo', testo => {
    console.log('📤 Testo inviato');
    io.emit('ricevi-testo', testo);
  });
  
  socket.on('svuota-display', () => {
    console.log('🗑️ Display svuotato');
    io.emit('svuota-testo');
  });
  
  socket.on('toggle-rotation', isRotated => {
    console.log('🔄 Toggle rotazione:', isRotated);
    io.emit('set-rotation', isRotated);
  });
  
  socket.on('disconnect', () => {
    console.log('✗ Client disconnesso:', socket.id);
  });
});

// Avvio server
server.listen(port, () => {
  console.log(`\n🚀 Server SGC Lyrics avviato!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🌐 URL disponibili:`);
  console.log(`   🏠 Homepage:        http://localhost:${port}/`);
  console.log(`   🔒 Login:           http://localhost:${port}/login`);
  console.log(`   📱 Control Panel:   http://localhost:${port}/control`);
  console.log(`   📺 Display:         http://localhost:${port}/display`);
  console.log(`   📱 Tablet:          http://localhost:${port}/tablet`);
  console.log(`   🔄 Display Rotato:  http://localhost:${port}/display-rotated`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n👤 Credenziali di accesso:`);
  console.log(`   Username: admin`);
  console.log(`   Password: admin`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});


