// server.js

const express = require('express');
const path = require('path');

const app = express();

// Statische Dateien aus dem "public"-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Starte den Server nur, wenn dieses Modul direkt ausgeführt wird
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
  });
}

// Exportiere die App für Tests
module.exports = app;
