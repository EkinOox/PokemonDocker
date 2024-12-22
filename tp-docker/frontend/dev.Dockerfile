# Utilisez une version r�cente de Node.js
FROM node:18-alpine

# Cr�er un utilisateur non-root
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app

# Copier les fichiers n�cessaires
COPY package*.json ./

# Changer les permissions pour l'utilisateur non-root
RUN chown -R appuser:appgroup /app

# Installer les d�pendances avec les permissions ad�quates
RUN npm install

# Copier tout le code source et changer les permissions
COPY . .
RUN chown -R appuser:appgroup /app

RUN npm run tailwind

# Changer l'utilisateur actif
USER appuser

EXPOSE 5173

# Lancer Tailwind et le serveur en mode d�veloppement
CMD ["sh", "-c", "npm run dev"]
