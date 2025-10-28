FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de package
COPY backend/package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le code source
COPY backend/ ./

# Exposer le port
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]