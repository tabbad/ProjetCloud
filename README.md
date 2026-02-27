# Projet TODO – Frontend React & Backend Express/Firebase

Ce projet est une application TODO composée :
- d’un frontend en React (Create React App) dans le dossier `src` ;
- d’un backend Node.js/Express connecté à Firebase Firestore dans le dossier `backend` ;
- d’un déploiement prévu sur Google Cloud (App Engine / Cloud Run) via les fichiers `app.yaml` et les scripts npm.

---

## 1. Prérequis

- Node.js (LTS recommandé)
- npm
- Un projet Firebase avec Firestore activé
- (Optionnel) Google Cloud SDK installé et configuré (`gcloud init`)

---

## 2. Installation

À la racine du projet :

```bash
npm install
cd backend
npm install
```

---

## 3. Lancement en développement

### 3.1 Backend

Dans le dossier `backend` :

```bash
npm run dev
```

Par défaut, l’API tourne sur `http://localhost:8080`.

Routes principales exposées par le backend :
- `GET /hello` – route de test simple
- `GET /test-firebase` – vérifie la connexion à Firebase
- `GET /todos` – liste tous les TODO
- `GET /todos/:id` – récupère un TODO spécifique
- `POST /todos` – crée un TODO
- `PUT /todos/:id` – met à jour un TODO
- `DELETE /todos/:id` – supprime un TODO

### 3.2 Frontend

À la racine du projet :

```bash
npm start
```

Le frontend est accessible sur `http://localhost:3000`.

---

## 4. Configuration Firebase

Le backend utilise un fichier `firebase.js` (dans `backend/`) pour se connecter à Firestore.

En environnement local (développement) :
- crée un fichier `.env` dans `backend/` si nécessaire ;
- configure les variables d’environnement attendues par `firebase.js` (identifiants de service, projet, etc.).

Pour la production (Google Cloud) :
- configure les identifiants d’application par défaut avec : `gcloud auth application-default login` ;
- vérifie que le projet GCP et Firebase sont bien liés.

---

## 5. Scripts npm disponibles

### Frontend (à la racine)

- `npm start` – démarre le frontend en mode développement
- `npm run build` – génère le build de production dans le dossier `build`
- `npm test` – lance les tests CRA
- `npm run eject` – éjecte la configuration CRA (opération irréversible)
- `npm run deploy:backend` – déploie le backend sur Google Cloud (depuis `backend/app.yaml`)
- `npm run deploy:frontend` – build puis déploie le frontend sur Google Cloud (via `app.yaml` à la racine)
- `npm run deploy:all` – déploie backend puis frontend

### Backend (dans `backend/`)

- `npm start` – démarre le serveur Express
- `npm run dev` – démarre le serveur avec `nodemon` (reload auto)

---

## 6. Déploiement sur Google Cloud

### 6.1 Backend

À la racine du projet :

```bash
npm run deploy:backend
```

Cela utilise le fichier `backend/app.yaml` et la commande `gcloud app deploy`.

### 6.2 Frontend

À la racine du projet :

```bash
npm run deploy:frontend
```

Cette commande construit l’application React puis déploie le contenu avec `gcloud app deploy` en utilisant `app.yaml` à la racine.

---

## 7. Tests et diagnostic

- Tester rapidement le backend : ouvrir `http://localhost:8080/hello`.
- Vérifier la connexion Firebase : `http://localhost:8080/test-firebase`.
- Utiliser Postman ou un autre client HTTP pour appeler les routes `/todos`.
- (Optionnel) Script PowerShell `test-connectivity.ps1` pour vérifier la connectivité réseau (à adapter si nécessaire).

---

## 8. Structure du projet

```text
.
├── app.yaml                # Config de déploiement frontend
├── Dockerfile              # (si utilisé) image de déploiement
├── backend/
│   ├── app.yaml            # Config de déploiement backend
│   ├── firebase.js         # Connexion Firebase/Firestore
│   ├── package.json        # Scripts backend
│   └── server.js           # API Express (routes /hello, /todos, etc.)
├── public/                 # Fichiers statiques CRA
├── src/                    # Code React
├── build/                  # Build frontend (généré)
└── test-connectivity.ps1   # Script de test de connectivité
```

---

## 9. Améliorations possibles

- Ajout d’authentification utilisateur (Firebase Auth)
- Gestion plus avancée des statuts TODO (priorité, tags, etc.)
- Ajout de tests end-to-end (Playwright / Cypress)
- Pipeline CI/CD pour le déploiement automatique sur Google Cloud
