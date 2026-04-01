FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev && \
    docker-php-ext-install pdo pdo_mysql zip && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -m backenduser && \
    chown -R backenduser:backenduser /var/www

WORKDIR /var/www

USER backenduser

COPY --chown=backenduser:backenduser . .

# S'assurer qu'aucun .env ne pollue l'image (toute la config vient des env vars K8s)
RUN rm -f .env .env.local .env.prod .env.prod.local

RUN composer install --no-dev --optimize-autoloader --no-scripts

# Symfony requiert un .env (même vide) pour son bootstrap
# Toute la config réelle vient des variables d'environnement K8s
RUN touch /var/www/.env

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
