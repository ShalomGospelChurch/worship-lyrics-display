// server.js
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const port = 3000;

// Serve i file statici dalla cartella 'views'
app.use(express.static(path.join(__dirname, 'views')));

// Route per index.html (homepage)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route per control.html
app.get('/control', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'control.html'));
});

// Route per display.html
app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'display.html'));
});

// Gestione connessioni WebSocket
io.on('connection', (socket) => {
  console.log('✓ Client connesso:', socket.id);

  // Quando la regia INVIA il testo
  socket.on('invia-testo', (testo) => {
    console.log('📤 Testo ricevuto dalla regia:', testo);
    io.emit('ricevi-testo', testo);
    console.log('✓ Testo inoltrato a tutti i display');
  });

  // Quando la regia SVUOTA il display
  socket.on('svuota-display', () => {
    console.log('🗑️ Richiesta svuotamento display');
    io.emit('svuota-testo');
    console.log('✓ Display svuotati');
  });

  socket.on('disconnect', () => {
    console.log('✗ Client disconnesso:', socket.id);
  });
});

// Avvia server
http.listen(port, () => {
  console.log(`\n🚀 Server avviato sulla porta ${port}`);
  console.log(`🏠 Homepage: http://localhost:${port}/`);
  console.log(`📱 Control: http://localhost:${port}/control`);
  console.log(`📺 Display: http://localhost:${port}/display\n`);
});