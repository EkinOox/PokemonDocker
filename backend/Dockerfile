FROM php:8.2-cli

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

RUN composer install --no-dev --optimize-autoloader --no-scripts

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
