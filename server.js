const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Importiamo le tue rotte di auth esistenti
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

// Rotte API esistenti (Login/Logout)
app.use('/api', authRoutes);

// --- NUOVA API PROXY PER FREESHOW (AGGIUNTA) ---
// Questa rotta serve per aggirare il problema CORS
app.post('/api/proxy-freeshow', requireAuth, async (req, res) => {
  try {
    // NOTA IMPORTANTE:
    // Se usi DOCKER, usa: 'http://host.docker.internal:5506...'
    // Se usi NODE in locale, usa: 'http://localhost:5506...'

    // Impostato per DOCKER come richiesto:
    const freeshowUrl = 'http://host.docker.internal:5506?action=get_plain_text';

    // Eseguiamo la chiamata dal server (che non ha limiti CORS)
    const response = await fetch(freeshowUrl, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`FreeShow ha risposto con errore: ${response.status}`);
    }

    const data = await response.json();
    res.json(data); // Restituiamo i dati al browser

  } catch (error) {
    console.error('Errore Proxy FreeShow:', error.message);
    res.status(500).json({
      error: 'Impossibile contattare FreeShow',
      details: error.message,
      hint: 'Assicurati che FreeShow sia aperto e che le API siano attive sulla porta 5506'
    });
  }
});
// ------------------------------------------------


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

app.get('/test1', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'test.html'));
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
    // Usiamo broadcast per mandare a tutti TRANNE il mittente,
    // oppure io.emit per mandare a TUTTI incluso il mittente.
    // io.emit è più sicuro per mantenere tutti sincronizzati.
    io.emit('ricevi-testo', testo);
  });

  socket.on('svuota-display', () => {
    console.log('🗑️ Display svuotato');
    io.emit('svuota-testo'); // Nota: nel client display ascoltavamo 'ricevi-testo' vuoto o 'svuota-testo'? Controlla il client.
    // Per sicurezza mandiamo anche un testo vuoto standard
    io.emit('ricevi-testo', '');
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
  console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
});