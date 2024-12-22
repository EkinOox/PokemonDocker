# Rapport de Projet Docker : Application basé sur les Pokémons

## Objectif du Projet
Le but de ce projet était de conteneuriser une application Pokémon composée d'un frontend en React, d'un backend en Symfony, et d'une base de données MariaDB, le tout orchestré à l'aide de Docker. Les objectifs principaux incluaient :

1. Mise en place de conteneurs séparés pour chaque service :
   - Frontend (React)
   - Backend (Symfony)
   - Base de données (MariaDB)
   - Outils supplémentaires (phpMyAdmin, Uptime Kuma, Portainer)

2. Utilisation de bonnes pratiques comme :
   - Création d'utilisateurs non-root pour les conteneurs.
   - Mise en place de healthchecks pour surveiller l'état des services.
   - Utilisation de réseaux Docker sécurisés (overlay).

3. Résolution des problèmes rencontrés lors du développement et du déploiement.

---

## Étapes Réalisées

### 1. **Configuration Initiale du Projet**

- Création de la structure du projet avec des dossiers dédiés :
  - `frontend/` pour React.
  - `backend/` pour Symfony.
  - `database/` pour les fichiers SQL initiaux.

- Écriture d'un fichier `docker-compose.yml` pour orchestrer les différents services.

### 2. **Mise en Place des Dockerfiles**

#### Frontend
- Création d'un `Dockerfile` pour React basé sur l'image `node:18-alpine`.
- Ajout d'un utilisateur non-root pour améliorer la sécurité.
- Installation des dépendances avec `npm install` et exécution en mode développement avec Tailwind.

#### Backend
- Création d'un `Dockerfile` pour Symfony basé sur l'image `php:8.2-cli`.
- Installation de Composer et des extensions nécessaires (PDO, ZIP, etc.).
- Ajout d'un utilisateur non-root.

### 3. **Ajout de Services Complémentaires**
- **phpMyAdmin** pour gérer la base de données MariaDB visuellement.
- **Uptime Kuma** pour surveiller l'état des conteneurs.
- **Portainer** pour gérer les conteneurs et visualiser les logs facilement.

### 4. **Réseaux et Volumes**
- Mise en place de réseaux Docker overlay sécurisés pour :
  - Communication entre frontend et backend.
  - Communication entre backend et la base de données.

- Définition de volumes pour :
  - Persistance des données de la base MariaDB.
  - Données d'Uptime Kuma.
  - Configuration de Portainer.

---

## Défis Rencontrés

### 1. **Problèmes de Connexion entre les Conteneurs**
- **Problème** : Le backend ne parvenait pas à se connecter à la base de données MariaDB.
- **Solution** :
  - Vérification et correction de l'URL de connexion dans les variables d'environnement (`DATABASE_URL`).
  - Ajout de dépendances explicites dans `docker-compose.yml`.

### 2. **Utilisation d'Utilisateurs Non-root**
- **Problème** : Les conteneurs utilisant un utilisateur non-root rencontraient des erreurs de permissions.
- **Solution** :
  - Utilisation de `chown` pour attribuer les permissions appropriées.
  - Ajout de `--chown` lors de la copie des fichiers avec `COPY` dans les Dockerfiles.

### 3. **Ports Mal Configurés**
- **Problème** : Le service `mariadb` renvoyait une erreur dans `docker-compose.yml` : "`services.mariadb.ports.0 must be a number`".
- **Solution** :
  - Suppression des ports inutilisés pour MariaDB, car la connexion se fait en interne via Docker.

### 4. **Surveillance des Conteneurs**
- **Problème** : Difficulté à surveiller l'état des conteneurs pendant le développement.
- **Solution** :
  - Mise en place de healthchecks pour chaque service dans `docker-compose.yml`.
  - Ajout d'Uptime Kuma pour une surveillance en continu.

---

## Bonnes Pratiques Adoptées

1. Utilisation d'utilisateurs non-root pour réduire les risques de sécurité.
2. Mise en place de healthchecks pour détecter rapidement les erreurs dans les services.
3. Sécurisation des réseaux Docker avec le driver overlay et chiffrement.
4. Gestion centralisée des ports et variables d'environnement via un fichier `.env`.
5. Organisation claire du projet avec des dossiers dédiés et des commentaires dans les fichiers de configuration.

---

## Résultats

- Tous les services fonctionnent correctement et communiquent entre eux :
  - Le frontend récupère les données du backend.
  - Le backend interagit avec la base de données MariaDB.
  - Les outils phpMyAdmin et Uptime Kuma permettent une gestion et une surveillance faciles.

- Le projet est prêt pour une utilisation en développement ou en production avec des ajustements mineurs (comme l'activation de TLS).

---

## Conclusion
Ce projet a permis d'approfondir les connaissances en conteneurisation avec Docker, en particulier sur :
- L'écriture de Dockerfiles optimisés.
- La gestion des dépendances et des permissions.
- L'orchestration de services complexes avec `docker-compose`.

Les défis rencontrés ont permis de renforcer les compétences en résolution de problèmes liés à la mise en réseau et à la configuration de conteneurs. Ce projet constitue une base solide pour des développements futurs.

---

## À Faire
1. Ajouter un environnement de test avec des pipelines CI/CD.
2. Implémenter HTTPS pour les services exposés.
3. Tester le déploiement sur un cluster Docker Swarm ou Kubernetes.
