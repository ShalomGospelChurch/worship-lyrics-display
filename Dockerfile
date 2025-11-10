# Usa un'immagine Node.js ufficiale
FROM node:18-alpine

# Imposta la cartella di lavoro all'interno del container
WORKDIR /app

# Copia prima il package.json per sfruttare la cache di Docker
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file (server.js, e i file html)
COPY . .

# Esponi la porta che il server usa
EXPOSE 3000

# Il comando per avviare il server
CMD [ "node", "server.js" ]