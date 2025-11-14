# 🎵 SGC Lyrics - Sistema di Gestione Testi per Worship

Sistema web per la proiezione e gestione dei testi delle canzoni durante i servizi di worship della **Shalom Gospel Church**.

---

## 📋 Indice

- [Caratteristiche](#-caratteristiche)
- [Tecnologie](#-tecnologie)
- [Installazione](#-installazione)
- [Utilizzo](#-utilizzo)
- [Ruoli Utente](#-ruoli-utente)
- [Funzionalità Admin](#-funzionalità-admin)
- [Display e Proiezione](#-display-e-proiezione)
- [Struttura Progetto](#-struttura-progetto)
- [API Endpoints](#-api-endpoints)
- [Docker](#-docker)

---

## ✨ Caratteristiche

- 🔐 **Sistema di autenticazione** con ruoli (Admin/Regia)
- 📺 **Display intelligente** con auto-ridimensionamento testo
- 🔄 **Display rotato** per proiezioni verticali
- 🎛️ **Pannello di controllo** per gestire i testi in tempo reale
- 👥 **Gestione utenti** (solo Admin)
- 🔑 **Reset password** (solo Admin)
- 🌐 **Real-time WebSocket** per sincronizzazione istantanea
- 🌙 **Dark mode** con tema chiaro/scuro
- 📱 **Responsive design** per mobile, tablet e desktop
- 🔤 **Supporto multilingua** (incluso Sinhala con font Noto Serif)

---

## 🛠️ Tecnologie

### Backend
- **Node.js** + Express
- **Socket.io** per comunicazione real-time
- **express-session** per gestione sessioni
- **bcryptjs** per hashing password

### Frontend
- **HTML5** + **JavaScript** (Vanilla)
- **Tailwind CSS** per styling
- **Socket.io Client** per WebSocket

### Altri
- **Docker** + **Docker Compose** per containerizzazione
- **Google Fonts** (Noto Serif Sinhala)

---

## 🚀 Installazione

### Prerequisiti
- Node.js (v14+)
- npm o yarn
- (Opzionale) Docker e Docker Compose

### 1. Clone del repository
```bash
git clone <repository-url>
cd SGC-Project_Tail
```

### 2. Installazione dipendenze
```bash
npm install
```

### 3. Avvio applicazione
```bash
npm start
```

L'applicazione sarà disponibile su: `http://localhost:3000`

### 4. Avvio con Docker (alternativo)
```bash
docker-compose up -d
```

---

## 📖 Utilizzo

### Prima configurazione

1. Vai su `http://localhost:3000`
2. Clicca su "Control Panel"
3. Verrai reindirizzato al login
4. Usa le credenziali di default:

**Utenti Admin:**
- Username: `admin1` o `admin2`
- Password: `admin123`

**Utenti Regia:**
- Username: `regia1` o `regia2`
- Password: `password123`

⚠️ **IMPORTANTE**: Cambia le password dopo il primo accesso!

### Workflow tipico

1. **Operatore regia** fa login
2. Apre il **Control Panel** (`/control`)
3. Scrive il testo della canzone
4. Clicca "Invia a Display"
5. Il testo appare istantaneamente sui display collegati
6. Può svuotare il display quando finisce la canzone

---

## 👤 Ruoli Utente

### 🔷 **Regia** (Operatore Standard)
**Può:**
- ✅ Accedere al Control Panel
- ✅ Inviare testi ai display
- ✅ Svuotare i display
- ✅ Cambiare la propria password

**Non può:**
- ❌ Gestire altri utenti
- ❌ Resettare password altrui
- ❌ Accedere al pannello Admin

### 🔴 **Admin** (Amministratore)
**Può fare tutto quello che fa Regia +:**
- ✅ Gestire utenti (aggiungi/modifica/elimina)
- ✅ Resettare password di qualsiasi utente
- ✅ Accedere al pannello Admin nascosto
- ✅ Modificare ruoli utenti

---

## 🔧 Funzionalità Admin

### Accesso al Pannello Admin (Easter Egg)

1. Fai login come **admin**
2. Vai sul **Control Panel**
3. **Clicca 8 volte** sul titolo "Pannello Regia Canti"
4. Apparirà il pulsante "⚙️ Admin"
5. Da lì accedi a tutte le funzionalità admin

### Gestione Utenti (`/user-management`)

#### ➕ **Aggiungere un nuovo utente**
1. Clicca "➕ Nuovo Utente"
2. Compila:
   - **Username**: identificativo univoco (es: `pippo`, `marco`)
   - **Nome Completo**: nome e cognome (es: "Pippo Rossi")
   - **Ruolo**: scegli `Admin` o `Regia`
   - **Password**: (opzionale, default: `password123`)
3. Clicca "Salva"

#### ✏️ **Modificare un utente**
1. Trova l'utente nella tabella
2. Clicca "✏️ Modifica"
3. Modifica Nome e/o Ruolo
4. ⚠️ Lo username NON è modificabile
5. Clicca "Salva"

#### 🗑️ **Eliminare un utente**
1. Trova l'utente nella tabella
2. Clicca "🗑️ Elimina"
3. Conferma l'eliminazione
4. ⚠️ Non puoi eliminare te stesso!

### Reset Password (`/admin-reset`)

#### 🔑 **Resettare password di un utente**
1. Vai su "Reset Password Utente"
2. Inserisci lo **username** dell'utente
3. (Opzionale) Inserisci nuova password personalizzata
4. Se lasci vuoto, la password diventerà `password123`
5. Clicca "Reset"
6. L'utente potrà fare login con la nuova password

---

## 📺 Display e Proiezione

### Display Normale (`/display`)
- Orientamento **orizzontale**
- Testo centrato con auto-ridimensionamento
- Ideale per proiettori e TV standard
- Font dinamico che si adatta al contenuto

### Display Rotato (`/display-rotated`)
- Orientamento **verticale** (rotazione -90°)
- Testo centrato con auto-ridimensionamento
- Ideale per monitor verticali o LED wall
- Supporto toggle rotazione via WebSocket

### Come funziona l'auto-ridimensionamento

Il sistema usa un **algoritmo di binary search** per trovare la dimensione ottimale del font:

1. Misura lo spazio disponibile (larghezza × altezza)
2. Prova diverse dimensioni di font (da 10px a 500px)
3. Verifica se il testo entra completamente
4. Trova la dimensione **massima** senza overflow
5. Applica il font con margini di sicurezza

**Risultato:**
- ✅ Su **mobile**: font grande, niente spazio sprecato
- ✅ Su **PC**: testo mai tagliato, sempre leggibile
- ✅ Su **display rotati**: perfettamente centrato

### Configurazione Multi-Display

**Scenario tipico:**
1. **Schermo proiettore** → `http://localhost:3000/display`
2. **Monitor palco** (orizzontale) → `http://localhost:3000/display`
3. **Monitor palco** (verticale) → `http://localhost:3000/display-rotated`
4. **Tablet regia** → `http://localhost:3000/control`

Tutti i display si aggiornano **istantaneamente** quando invii il testo!

---

## 📁 Struttura Progetto

```
SGC-Project_Tail/
├── node_modules/          # Dipendenze npm
├── routes/
│   ├── auth.js           # Autenticazione e login
│   └── admin.js          # Gestione utenti (solo admin)
├── utils/
│   └── users.js          # Funzioni per gestione utenti
├── views/
│   ├── index.html        # Homepage
│   ├── login.html        # Pagina di login
│   └── pages/
│       ├── control.html         # Pannello di controllo
│       ├── display.html         # Display normale
│       ├── display-rotated.html # Display rotato
│       ├── change-password.html # Cambio password
│       ├── admin-reset.html     # Reset password (admin)
│       └── user-management.html # Gestione utenti (admin)
├── server.js             # Server Express + Socket.io
├── users.json           # Database utenti (auto-generato)
├── package.json         # Configurazione npm
├── Dockerfile           # Configurazione Docker
├── docker-compose.yml   # Docker Compose
├── .gitignore          # File ignorati da Git
└── README.md           # Questa documentazione
```

---

## 🔌 API Endpoints

### Autenticazione

#### `POST /api/login`
Effettua il login
```json
// Request
{
  "username": "admin1",
  "password": "password123"
}

// Response (200)
{
  "success": true
}

// Response (401)
{
  "message": "Credenziali non valide"
}
```

#### `POST /api/logout`
Effettua il logout (richiede autenticazione)
```json
// Response (200)
{
  "success": true
}
```

#### `POST /api/change-password`
Cambia la propria password (richiede autenticazione)
```json
// Request
{
  "oldPassword": "password123",
  "newPassword": "nuovaPassword456"
}

// Response (200)
{
  "success": true,
  "message": "Password aggiornata"
}
```

#### `GET /api/check-admin`
Verifica se l'utente è admin (richiede autenticazione)
```json
// Response (200)
{
  "isAdmin": true,
  "username": "admin1",
  "role": "admin",
  "name": "Amministratore 1"
}
```

### Admin (Solo per utenti Admin)

#### `GET /api/admin/users`
Ottiene lista di tutti gli utenti
```json
// Response (200)
{
  "admin1": {
    "name": "Amministratore 1",
    "role": "admin"
  },
  "regia1": {
    "name": "Operatore Regia 1",
    "role": "regia"
  }
}
```

#### `POST /api/admin/users`
Crea un nuovo utente
```json
// Request
{
  "username": "jerry",
  "name": "Jerry Fernando",
  "role": "admin",
  "password": "myPassword"  // opzionale
}

// Response (201)
{
  "success": true,
  "message": "Utente jerry creato"
}
```

#### `PUT /api/admin/users/:username`
Modifica un utente esistente
```json
// Request
{
  "name": "Jerry Fernando Updated",
  "role": "regia"
}

// Response (200)
{
  "success": true,
  "message": "Utente jerry aggiornato"
}
```

#### `DELETE /api/admin/users/:username`
Elimina un utente
```json
// Response (200)
{
  "success": true,
  "message": "Utente jerry eliminato"
}
```

#### `POST /api/admin/reset-password`
Reset password di un utente
```json
// Request
{
  "username": "regia1",
  "newPassword": "nuovaPass123"  // opzionale
}

// Response (200)
{
  "success": true,
  "message": "Password di regia1 resettata"
}
```

---

## 🌐 WebSocket Events

### Client → Server

#### `invia-testo`
Invia testo ai display
```javascript
socket.emit('invia-testo', 'Testo della canzone...');
```

#### `svuota-display`
Svuota tutti i display
```javascript
socket.emit('svuota-display');
```

#### `toggle-rotation`
Attiva/disattiva rotazione display
```javascript
socket.emit('toggle-rotation', true);  // true = rotato
```

### Server → Client

#### `ricevi-testo`
Riceve testo da mostrare
```javascript
socket.on('ricevi-testo', (testo) => {
  console.log('Testo ricevuto:', testo);
});
```

#### `svuota-testo`
Riceve comando di svuotamento
```javascript
socket.on('svuota-testo', () => {
  console.log('Display svuotato');
});
```

#### `set-rotation`
Riceve comando di rotazione
```javascript
socket.on('set-rotation', (isRotated) => {
  console.log('Rotazione:', isRotated);
});
```

---

## 🐳 Docker

### Build immagine
```bash
docker build -t sgc-lyrics .
```

### Run container
```bash
docker run -p 3000:3000 sgc-lyrics
```

### Docker Compose
```bash
# Avvia
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

### File persistenti con Docker

Il file `users.json` viene generato automaticamente nel container. Per mantenerlo tra riavvii, usa un volume:

```yaml
# docker-compose.yml
volumes:
  - ./users.json:/app/users.json
```

---

## 🔒 Sicurezza

### Best Practices

1. **Cambia le password di default** immediatamente
2. **Usa password complesse** (min. 8 caratteri)
3. **Non condividere credenziali** admin
4. **Cambia il session secret** in `server.js`:
   ```javascript
   secret: 'TUA-CHIAVE-SEGRETA-CASUALE'
   ```
5. **Usa HTTPS** in produzione
6. **Backup regolari** di `users.json`

### Password Hashing

Le password sono protette con **bcryptjs** (salt rounds: 10)
```javascript
// Esempio hash
$2b$10$XQKaVzPL8Nrq9xMKW3lhzeNKZ7hq1WFLFQZvKp3qR5dHJ6yN2Q0Ym
```

---

## 🎨 Personalizzazione

### Cambiare colori tema

Modifica i colori Tailwind nei file HTML:

```html
<!-- Esempio: cambiare colore bottone -->
<button class="bg-blue-600 hover:bg-blue-700">
  <!-- Cambia blue-600 con red-600, green-600, etc. -->
</button>
```

### Cambiare font display

Nel file `display.html` o `display-rotated.html`:

```html
<!-- Cambia il link Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=TUO-FONT&display=swap" rel="stylesheet">

<!-- Cambia la classe CSS -->
<style>
  .custom-font {
    font-family: "TUO-FONT", serif;
  }
</style>
```

### Modificare porta server

Nel file `server.js`:

```javascript
const port = 3000;  // Cambia con la porta desiderata
```

---
