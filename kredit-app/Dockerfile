# Dockerfile

# Basis-Image
FROM node:14-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Kopieren der package.json und package-lock.json
COPY package*.json ./

# Installieren der Abhängigkeiten
RUN npm install

# Kopieren des Restes des Anwendungscodes
COPY . .

# Exponieren des Ports
EXPOSE 3000

# Startbefehl
CMD ["npm", "start"]
