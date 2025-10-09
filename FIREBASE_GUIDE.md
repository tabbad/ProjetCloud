# Guide d'intégration Firestore

## 🔥 Firestore Database intégré !

### Votre projet Firebase
- **Project ID** : `testcloud-ef721`
- **Console** : https://console.firebase.google.com/project/testcloud-ef721/firestore
- **Collection** : `TODO`

## 📋 Routes API disponibles

### Backend API Routes
- `GET /` - Information sur l'API
- `GET /hello` - Route de test
- `GET /todos` - Lire tous les TODOs
- `GET /todos/:id` - Lire un TODO spécifique
- `POST /todos` - Créer/Ajouter un TODO
- `PUT /todos/:id` - Mettre à jour un TODO
- `DELETE /todos/:id` - Supprimer un TODO

## 🧪 Tests avec curl

### 1. Lire tous les TODOs
```bash
curl https://backend-api-dot-apptest-474412.lm.r.appspot.com/todos
```

### 2. Ajouter un TODO
```bash
curl -X POST https://backend-api-dot-apptest-474412.lm.r.appspot.com/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Mon premier TODO", "description": "Ceci est un test", "completed": false}'
```

### 3. Lire un TODO spécifique (remplacer ID par un vrai ID)
```bash
curl https://backend-api-dot-apptest-474412.lm.r.appspot.com/todos/YOUR_ID
```

### 4. Mettre à jour un TODO (remplacer ID par un vrai ID)
```bash
curl -X PUT https://backend-api-dot-apptest-474412.lm.r.appspot.com/todos/YOUR_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "TODO mis à jour", "completed": true}'
```

### 5. Supprimer un TODO (remplacer ID par un vrai ID)
```bash
curl -X DELETE https://backend-api-dot-apptest-474412.lm.r.appspot.com/todos/YOUR_ID
```

## 🚀 Test en local

1. **Démarrer le backend** :
   ```bash
   cd backend
   npm start
   ```

2. **Démarrer le frontend** :
   ```bash
   npm start
   ```

3. **Tester dans le navigateur** : http://localhost:3000

## ⚠️ Configuration importante pour la production

### 1. Clé de service Firebase (recommandé pour la production)

Pour la production, il est recommandé d'utiliser une clé de service :

1. Aller dans Firebase Console > Project Settings > Service accounts
2. Générer une nouvelle clé privée
3. Télécharger le fichier JSON
4. Le mettre dans `backend/serviceAccountKey.json`
5. Modifier `backend/firebase.js` :

```javascript
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testcloud-ef721-default-rtdb.europe-west1.firebasedatabase.app/"
});
```

### 2. Variables d'environnement

Créer un fichier `.env` dans le backend :
```env
FIREBASE_DATABASE_URL=https://testcloud-ef721-default-rtdb.europe-west1.firebasedatabase.app/
NODE_ENV=production
```

## 📱 Interface utilisateur

Le frontend a maintenant deux sections :
1. **Test Route Hello** - Pour tester la route basique
2. **Test Firebase Database** - Pour lire et ajouter des données Firebase

## 🔧 Déploiement

```bash
# Déployer le backend avec Firebase
cd backend
gcloud app deploy

# Déployer le frontend
cd ..
npm run build
gcloud app deploy
```