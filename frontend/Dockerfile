# Stage 1 : Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Génération du CSS Tailwind (sans --watch) puis build Vite
RUN npx tailwindcss -i ./src/index.css -o ./src/output.css --minify
RUN npm run build

# Stage 2 : Serve avec nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
