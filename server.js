// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);
const basicAuth = require('express-basic-auth');

const port = 3000;

const users = {
  'admin': 'admin'
};

app.use('/control.html', basicAuth({
  users: users,
  challenge: true, // Mostra il pop-up di login
  unauthorizedResponse: 'Accesso non autorizzato'
}));

// Serve i file HTML statici
app.use(express.static(__dirname));

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
  console.log(`📱 Regia: http://localhost:${port}/control.html`);
  console.log(`📺 Display: http://localhost:${port}/display.html\n`);
});