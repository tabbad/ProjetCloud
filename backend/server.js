const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route /hello
app.get('/hello', (req, res) => {
  res.json({
    message: 'Hello World! mec',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Backend',
    version: '1.0.0',
    endpoints: ['/hello']
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`👋 Route /hello disponible sur http://localhost:${PORT}/hello`);
});

module.exports = app;