# Dockerfile

# Basis-Image
FROM node:20-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Produktionsmodus und aktualisiertes npm (behebt bekannte npm Abhängigkeits-SSS)
ENV NODE_ENV=production
RUN npm i -g npm@latest

# Kopieren der package.json und package-lock.json und nur Prod-Abhängigkeiten installieren
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Kopieren des Restes des Anwendungscodes
COPY . .

# Exponieren des Ports
EXPOSE 3000

# Sicherheit: als nicht-root Nutzer laufen lassen, wenn möglich
USER node

# Startbefehl
CMD ["npm", "start"]
