# Rapport de Projet Docker : Application bas� sur les Pok�mons

## Objectif du Projet
Le but de ce projet �tait de conteneuriser une application Pok�mon compos�e d'un frontend en React, d'un backend en Symfony, et d'une base de donn�es MariaDB, le tout orchestr� � l'aide de Docker. Les objectifs principaux incluaient :

1. Mise en place de conteneurs s�par�s pour chaque service :
   - Frontend (React)
   - Backend (Symfony)
   - Base de donn�es (MariaDB)
   - Outils suppl�mentaires (phpMyAdmin, Uptime Kuma, Portainer)

2. Utilisation de bonnes pratiques comme :
   - Cr�ation d'utilisateurs non-root pour les conteneurs.
   - Mise en place de healthchecks pour surveiller l'�tat des services.
   - Utilisation de r�seaux Docker s�curis�s (overlay).

3. R�solution des probl�mes rencontr�s lors du d�veloppement et du d�ploiement.

---

## �tapes R�alis�es

### 1. **Configuration Initiale du Projet**

- Cr�ation de la structure du projet avec des dossiers d�di�s :
  - `frontend/` pour React.
  - `backend/` pour Symfony.
  - `database/` pour les fichiers SQL initiaux.

- �criture d'un fichier `docker-compose.yml` pour orchestrer les diff�rents services.

### 2. **Mise en Place des Dockerfiles**

#### Frontend
- Cr�ation d'un `Dockerfile` pour React bas� sur l'image `node:18-alpine`.
- Ajout d'un utilisateur non-root pour am�liorer la s�curit�.
- Installation des d�pendances avec `npm install` et ex�cution en mode d�veloppement avec Tailwind.

#### Backend
- Cr�ation d'un `Dockerfile` pour Symfony bas� sur l'image `php:8.2-cli`.
- Installation de Composer et des extensions n�cessaires (PDO, ZIP, etc.).
- Ajout d'un utilisateur non-root.

### 3. **Ajout de Services Compl�mentaires**
- **phpMyAdmin** pour g�rer la base de donn�es MariaDB visuellement.
- **Uptime Kuma** pour surveiller l'�tat des conteneurs.
- **Portainer** pour g�rer les conteneurs et visualiser les logs facilement.

### 4. **R�seaux et Volumes**
- Mise en place de r�seaux Docker overlay s�curis�s pour :
  - Communication entre frontend et backend.
  - Communication entre backend et la base de donn�es.

- D�finition de volumes pour :
  - Persistance des donn�es de la base MariaDB.
  - Donn�es d'Uptime Kuma.
  - Configuration de Portainer.

---

## D�fis Rencontr�s

### 1. **Probl�mes de Connexion entre les Conteneurs**
- **Probl�me** : Le backend ne parvenait pas � se connecter � la base de donn�es MariaDB.
- **Solution** :
  - V�rification et correction de l'URL de connexion dans les variables d'environnement (`DATABASE_URL`).
  - Ajout de d�pendances explicites dans `docker-compose.yml`.

### 2. **Utilisation d'Utilisateurs Non-root**
- **Probl�me** : Les conteneurs utilisant un utilisateur non-root rencontraient des erreurs de permissions.
- **Solution** :
  - Utilisation de `chown` pour attribuer les permissions appropri�es.
  - Ajout de `--chown` lors de la copie des fichiers avec `COPY` dans les Dockerfiles.

### 3. **Ports Mal Configur�s**
- **Probl�me** : Le service `mariadb` renvoyait une erreur dans `docker-compose.yml` : "`services.mariadb.ports.0 must be a number`".
- **Solution** :
  - Suppression des ports inutilis�s pour MariaDB, car la connexion se fait en interne via Docker.

### 4. **Surveillance des Conteneurs**
- **Probl�me** : Difficult� � surveiller l'�tat des conteneurs pendant le d�veloppement.
- **Solution** :
  - Mise en place de healthchecks pour chaque service dans `docker-compose.yml`.
  - Ajout d'Uptime Kuma pour une surveillance en continu.

---

## Bonnes Pratiques Adopt�es

1. Utilisation d'utilisateurs non-root pour r�duire les risques de s�curit�.
2. Mise en place de healthchecks pour d�tecter rapidement les erreurs dans les services.
3. S�curisation des r�seaux Docker avec le driver overlay et chiffrement.
4. Gestion centralis�e des ports et variables d'environnement via un fichier `.env`.
5. Organisation claire du projet avec des dossiers d�di�s et des commentaires dans les fichiers de configuration.

---

## R�sultats

- Tous les services fonctionnent correctement et communiquent entre eux :
  - Le frontend r�cup�re les donn�es du backend.
  - Le backend interagit avec la base de donn�es MariaDB.
  - Les outils phpMyAdmin et Uptime Kuma permettent une gestion et une surveillance faciles.

- Le projet est pr�t pour une utilisation en d�veloppement ou en production avec des ajustements mineurs (comme l'activation de TLS).

---

## Conclusion
Ce projet a permis d'approfondir les connaissances en conteneurisation avec Docker, en particulier sur :
- L'�criture de Dockerfiles optimis�s.
- La gestion des d�pendances et des permissions.
- L'orchestration de services complexes avec `docker-compose`.

Les d�fis rencontr�s ont permis de renforcer les comp�tences en r�solution de probl�mes li�s � la mise en r�seau et � la configuration de conteneurs. Ce projet constitue une base solide pour des d�veloppements futurs.

---

## � Faire
1. Ajouter un environnement de test avec des pipelines CI/CD.
2. Impl�menter HTTPS pour les services expos�s.
3. Tester le d�ploiement sur un cluster Docker Swarm ou Kubernetes.
