// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const port = 3000; // La porta su cui girerà il server

// Serve i file HTML (control.html e display.html)
app.use(express.static(__dirname));

// Gestione delle connessioni
io.on('connection', (socket) => {
  console.log('Un client si è connesso: ' + socket.id);

  // Quando riceve un messaggio dal PC di regia...
  socket.on('invia-testo', (testo) => {
    console.log('Testo ricevuto:', testo);
    
    // ...lo invia a tutti gli altri client (tablet, monitor)
    socket.broadcast.emit('ricevi-testo', testo);
  });

  socket.on('disconnect', () => {
    console.log('Un client si è disconnesso: ' + socket.id);
  });
});

// Avvia il server
http.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
  console.log(`Apri http://localhost:${port}/control.html per la regia`);
  console.log(`Apri http://TUO_IP_LOCALE:${port}/display.html per i monitor`);
});