# Utilisez une version récente de Node.js
FROM node:18-alpine

# Créer un utilisateur non-root
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./

# Changer les permissions pour l'utilisateur non-root
RUN chown -R appuser:appgroup /app

# Installer les dépendances avec les permissions adéquates
RUN npm install

# Copier tout le code source et changer les permissions
COPY . .
RUN chown -R appuser:appgroup /app

RUN npm run tailwind

# Changer l'utilisateur actif
USER appuser

EXPOSE 5173

# Lancer Tailwind et le serveur en mode développement
CMD ["sh", "-c", "npm run dev"]
