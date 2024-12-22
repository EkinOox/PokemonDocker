FROM php:8.2-cli

# Installation des dépendances de base
RUN apt-get update && apt-get install -y \
    nano \
    git \
    unzip \
    mariadb-client \
    libpq-dev \
    libzip-dev && \
    docker-php-ext-install pdo pdo_mysql zip

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Création d'un utilisateur non-root
RUN useradd -m backenduser && \
    chown -R backenduser:backenduser /var/www

# Définir le dossier de travail
WORKDIR /var/www

# Passer à l'utilisateur non-root
USER backenduser

# Copier le code source dans le conteneur
COPY --chown=backenduser:backenduser . .

# Installer les dépendances PHP avec Composer
RUN composer install --optimize-autoloader
RUN composer require symfony/orm-pack
RUN composer require symfony/password-hasher
RUN composer require symfony/security-bundle

# Exposer le port utilisé par Symfony
EXPOSE 8000

# Lancer le serveur Symfony en mode dev
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
