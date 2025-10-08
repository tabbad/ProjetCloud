# Backend API

Ce dossier contient le serveur backend avec une API Express.js.

## Installation

```bash
cd backend
npm install
```

## Démarrage

### Mode développement (avec redémarrage automatique)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur sera disponible sur `http://localhost:5000`

## Routes disponibles

- `GET /` - Information sur l'API
- `GET /hello` - Route hello qui retourne un message de bienvenue

## Exemple d'utilisation

```bash
# Test de la route hello
curl http://localhost:5000/hello
```

Réponse attendue :
```json
{
  "message": "Hello World!",
  "timestamp": "2025-10-08T...",
  "status": "success"
}
```