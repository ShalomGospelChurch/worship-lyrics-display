// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const port = 3000;

// Serve i file HTML statici
app.use(express.static(__dirname));

// Gestione connessioni WebSocket
io.on('connection', (socket) => {
  console.log('✓ Client connesso:', socket.id);

  // Quando la regia INVIA il testo (click bottone)
  socket.on('invia-testo', (testo) => {
    console.log('📤 Testo ricevuto dalla regia:', testo);
    
    // Inoltra a TUTTI i display connessi
    io.emit('ricevi-testo', testo);
    
    console.log('✓ Testo inoltrato a tutti i display');
  });

  socket.on('disconnect', () => {
    console.log('✗ Client disconnesso:', socket.id);
  });
});

// Avvia server
http.listen(port, () => {
  console.log(`\n🚀 Server avviato sulla porta ${port}`);
  console.log(`📱 Regia: http://localhost:${port}/control.html`);
  console.log(`📺 Display: http://localhost:${port}/display.html\n`);
});