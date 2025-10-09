# Guide de déploiement sur Google App Engine

## Prérequis

1. **Google Cloud CLI installé** :
   ```bash
   # Télécharger depuis : https://cloud.google.com/sdk/docs/install
   ```

2. **Projet Google Cloud configuré** :
   ```bash
   gcloud auth login
   gcloud config set project [VOTRE_PROJECT_ID]
   ```

## Étapes de déploiement

### 1. Déployer le Backend (API)

```bash
# Se placer dans le dossier backend
cd backend

# Déployer le service backend
gcloud app deploy app.yaml --version=v1 --no-promote
```

### 2. Construire et déployer le Frontend

```bash
# Retourner au dossier racine
cd ..

# Construire l'application React
npm run build

# Déployer le service frontend (default)
gcloud app deploy app.yaml --version=v1
```

### 3. Commandes utiles

```bash
# Voir les services déployés
gcloud app services list

# Voir les versions
gcloud app versions list

# Promouvoir une version
gcloud app versions migrate [VERSION]

# Voir les logs
gcloud app logs tail -s backend-api
gcloud app logs tail -s default

# Ouvrir l'application dans le navigateur
gcloud app browse
gcloud app browse -s backend-api
```

## URLs après déploiement

- **Frontend** : `https://[VOTRE_PROJECT_ID].ew.r.appspot.com`
- **Backend API** : `https://backend-api-dot-[VOTRE_PROJECT_ID].ew.r.appspot.com`

## Configuration importante

⚠️ **N'oubliez pas de** :

1. Remplacer `[VOTRE_PROJECT_ID]` dans `src/App.js` par votre vrai Project ID
2. Configurer les variables d'environnement si nécessaire
3. Configurer CORS dans le backend si vous avez des problèmes de domaine
4. Vérifier que le build React fonctionne localement avant de déployer

## Scripts package.json recommandés

Ajoutez ces scripts à votre `package.json` :

```json
{
  "scripts": {
    "deploy:backend": "cd backend && gcloud app deploy",
    "deploy:frontend": "npm run build && gcloud app deploy",
    "deploy:all": "npm run deploy:backend && npm run deploy:frontend"
  }
}
```