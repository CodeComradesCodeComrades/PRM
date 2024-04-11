# Basis-Image
FROM node:16-alpine

# Arbeitsverzeichnis für das Backend festlegen
WORKDIR /usr/src/app/server

# Kopiere die Backend-Dateien und installiere die Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopiere den restlichen Backend-Code
COPY . .

# Setze das Arbeitsverzeichnis zurück zum Server
WORKDIR /usr/src/app/server

# Startbefehl
CMD ["npm", "run", "dev"]
