# Déploiement Kubernetes — PokemonDocker

## Vue d'ensemble

Ce dossier contient tous les manifests Kubernetes pour déployer l'application PokemonDocker sur un cluster Infomaniak Public Cloud.

**Stack applicative :**
- Frontend : React + Vite + Tailwind, servi par nginx
- Backend : Symfony PHP 8.2, servi par le serveur intégré PHP
- Base de données : MariaDB 11

**Infrastructure :**
- Cluster : Infomaniak Public Cloud (nœud `pck-n48nwgo-p9d-bqt9r-zvrq4`, Ubuntu 24.04, AMD64)
- Namespace K8s : `pokemon`
- Domaine : `pokemon.portfolio-kdiochon.fr` → `83.228.234.98`
- Images Docker Hub : `ekinoox/pokemon-backend:latest`, `ekinoox/pokemon-frontend:latest`

---

## Structure des manifests

```
k8s/
├── .env                      # Variables locales (REGISTRY=ekinoox) — gitignore
├── deploy.sh                 # Script de déploiement complet
├── namespace.yaml            # Namespace "pokemon"
├── secrets.yaml              # Secrets K8s (gitignore)
├── ingress.yaml              # Ingress nginx (routing HTTP + rewrite-target)
├── mariadb/
│   ├── configmap.yaml        # Script d'initialisation SQL
│   ├── pvc.yaml              # PersistentVolumeClaim (1Gi)
│   ├── deployment.yaml       # Déploiement MariaDB (strategy: Recreate)
│   └── service.yaml          # Service ClusterIP port 3306
├── backend/
│   ├── deployment.yaml       # Déploiement backend (2 replicas)
│   ├── service.yaml          # Service ClusterIP port 8000
│   └── migration-job.yaml    # Job Doctrine migrations (one-off)
├── frontend/
│   ├── deployment.yaml       # Déploiement frontend (2 replicas)
│   └── service.yaml          # Service ClusterIP port 80
└── uptime-kuma/
    ├── pvc.yaml              # PersistentVolumeClaim (1Gi) pour les données Kuma
    ├── deployment.yaml       # Déploiement Uptime Kuma (1 replica)
    └── service.yaml          # Service ClusterIP port 3001
```

---

## Prérequis

### 1. KUBECONFIG

```bash
export KUBECONFIG=~/kube/kyllian/pck-n48nwgo-kubeconfig
```

Ajouter dans `~/.zshrc` pour ne pas avoir à le relancer à chaque session.

### 2. Ingress Controller nginx

Installé une seule fois sur le cluster :

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
```

Récupérer l'IP externe :

```bash
kubectl get svc ingress-nginx-controller -n ingress-nginx
# EXTERNAL-IP → 83.228.234.98
```

### 3. DNS

Entrée A configurée chez le registrar :

```
pokemon.portfolio-kdiochon.fr  A  83.228.234.98
```

### 4. Secrets K8s

Créer `k8s/secrets.yaml` (ce fichier est dans `.gitignore`, ne jamais le committer) :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mariadb-secret
  namespace: pokemon
type: Opaque
data:
  mysql-root-password: <base64>   # echo -n "valeur" | base64
  mysql-user: <base64>
  mysql-password: <base64>
  mysql-database: <base64>
  database-url: <base64>          # mysql://user:password@mariadb:3306/pokemon?serverVersion=10.11.2-MariaDB&charset=utf8mb4
---
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
  namespace: pokemon
type: Opaque
data:
  app-secret: <base64>            # openssl rand -hex 32 | base64
```

### 5. Fichier k8s/.env

```bash
REGISTRY=ekinoox
```

---

## Build des images Docker

> **Important :** Le Mac est ARM (Apple Silicon), le cluster est AMD64. Toujours builder avec `--platform linux/amd64`.

### Backend (Symfony)

```bash
docker buildx build --platform linux/amd64 \
  -t ekinoox/pokemon-backend:latest \
  -f backend/Dockerfile ./backend --push
```

### Frontend (React + nginx)

```bash
docker buildx build --platform linux/amd64 \
  -t ekinoox/pokemon-frontend:latest \
  -f frontend/Dockerfile ./frontend --push
```

---

## Déploiement

### Via le script automatisé

```bash
cd k8s
export KUBECONFIG=~/kube/kyllian/pck-n48nwgo-kubeconfig
./deploy.sh
```

Le script :
1. Applique le namespace et les secrets
2. Déploie MariaDB et attend qu'elle soit prête
3. Exécute le job de migrations Doctrine (`Factor XII`)
4. Déploie backend, frontend, Uptime Kuma et l'ingress

### Déploiement manuel étape par étape

```bash
export KUBECONFIG=~/kube/kyllian/pck-n48nwgo-kubeconfig
cd /chemin/vers/PokemonDocker

# 1. Namespace & secrets
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml

# 2. MariaDB
kubectl apply -f k8s/mariadb/
kubectl rollout status deployment/mariadb -n pokemon --timeout=120s

# 3. Migrations (job one-off)
kubectl delete job doctrine-migrations -n pokemon --ignore-not-found
REGISTRY=ekinoox envsubst < k8s/backend/migration-job.yaml | kubectl apply -f -
kubectl wait --for=condition=complete job/doctrine-migrations -n pokemon --timeout=120s

# 4. Backend
REGISTRY=ekinoox envsubst < k8s/backend/deployment.yaml | kubectl apply -f -
kubectl apply -f k8s/backend/service.yaml

# 5. Frontend
REGISTRY=ekinoox envsubst < k8s/frontend/deployment.yaml | kubectl apply -f -
kubectl apply -f k8s/frontend/service.yaml

# 6. Uptime Kuma
kubectl apply -f k8s/uptime-kuma/

# 7. Ingress
kubectl apply -f k8s/ingress.yaml
```

---

## Vérification

```bash
export KUBECONFIG=~/kube/kyllian/pck-n48nwgo-kubeconfig

# État des pods
kubectl get pods -n pokemon

# Logs backend
kubectl logs -n pokemon -l app=backend --tail=50

# Logs migrations
kubectl logs -n pokemon -l job-name=doctrine-migrations --tail=30

# Ingress
kubectl get ingress -n pokemon
```

Résultat attendu :

```
NAME                         READY   STATUS      RESTARTS
doctrine-migrations-xxxxx    0/1     Completed   0
mariadb-xxxxx                1/1     Running     0
backend-xxxxx                1/1     Running     0
backend-yyyyy                1/1     Running     0
frontend-xxxxx               1/1     Running     0
frontend-yyyyy               1/1     Running     0
uptime-kuma-xxxxx            1/1     Running     0
```

---

## Conformité Twelve-Factor App

| Facteur | Description | Implémentation |
|---------|-------------|----------------|
| I. Codebase | Un dépôt, plusieurs déploiements | Git → Docker Hub |
| II. Dependencies | Dépendances déclarées | `composer.json`, `package.json` |
| III. Config | Config dans l'environnement | Secrets K8s → variables d'env |
| IV. Backing services | DB traitée comme ressource attachée | `DATABASE_URL` configurable |
| V. Build/Release/Run | Phases séparées | Dockerfile multi-stage + K8s |
| VI. Processes | Processus sans état | Backend stateless, pas de session serveur |
| VII. Port binding | Exposition via port | PHP `-S 0.0.0.0:8000`, nginx `:80` |
| VIII. Concurrency | Scale par type de processus | `replicas: 2` backend & frontend |
| IX. Disposability | Démarrage rapide, arrêt propre | `restartPolicy: OnFailure`, probes |
| X. Dev/prod parity | Parité dev/prod | Même MariaDB 11, même Symfony |
| XI. Logs | Logs vers stdout/stderr | nginx : `access_log /dev/stdout` |
| XII. Admin processes | Tâches admin en one-off | Job K8s `doctrine-migrations` |

---

## Modifications apportées au code source

### Frontend

| Fichier | Modification |
|---------|-------------|
| `src/pages/connexion.jsx` | `http://localhost:8000/api/login` → `/api/login` |
| `src/pages/inscription.jsx` | `http://localhost:8000/api/users` → `/api/users` |
| `src/UserList.jsx` | `http://localhost:8000/api/users` → `/api/users` |
| `vite.config.js` | Ajout proxy `/api` → `localhost:8000` (dev uniquement) |
| `nginx.conf` (nouveau) | SPA fallback, proxy tyradex, logs stdout |

### Backend

| Fichier | Modification |
|---------|-------------|
| `config/packages/doctrine.yaml` | Remplacement host hardcodé → `url: '%env(DATABASE_URL)%'` |
| `config/packages/nelmio_cors.yaml` | `allow_origin` → `%env(CORS_ALLOW_ORIGIN)%` |
| `src/Controller/UserController.php` | Suppression `SessionInterface` (backend stateless) |
| `.env` | Nettoyé, valeurs dev uniquement |

---

## Problèmes rencontrés et solutions

### Images ARM sur cluster AMD64
**Symptôme :** `exec format error` au démarrage des pods  
**Cause :** Build sur Mac Apple Silicon = image ARM  
**Solution :** `--platform linux/amd64` sur toutes les commandes `docker buildx build`

### Probe MariaDB échoue
**Symptôme :** Pod MariaDB en CrashLoopBackOff  
**Cause :** `mysqladmin` absent dans MariaDB 11  
**Solution :** Probe `tcpSocket` sur le port 3306 à la place de `exec`

### Conflit PVC ReadWriteOnce (rolling update)
**Symptôme :** Nouveau pod MariaDB bloqué en Pending  
**Cause :** Deux pods tentent de monter le même volume RWO simultanément  
**Solution :** `strategy: Recreate` dans le Deployment MariaDB

### `DATABASE_URL` ignorée — connexion sur `mariadb-docker`
**Symptôme :** job migrations échoue avec `getaddrinfo for mariadb-docker failed`  
**Cause 1 :** Fichier `.env` (avec l'hôte dev `mariadb-docker`) copié dans l'image malgré `.dockerignore`  
**Solution 1 :** `RUN rm -f .env .env.local ...` dans le Dockerfile + `RUN touch /var/www/.env` vide  
**Cause 2 :** `config/packages/doctrine.yaml` avait `host: 'mariadb-docker'` codé en dur, ignorant `DATABASE_URL`  
**Solution 2 :** Remplacé par `url: '%env(DATABASE_URL)%'` — Symfony lit maintenant la variable d'env K8s

### Job migrations échoue — aucune migration enregistrée
**Symptôme :** `[ERROR] The version "latest" couldn't be reached, there are no registered migrations.`  
**Cause :** Le dossier `backend/migrations/` est vide car le schéma est créé par `init.sql` (ConfigMap MariaDB), pas par Doctrine Migrations  
**Solution :** Ajout du flag `--allow-no-migration` dans `migration-job.yaml` — le job se termine en `Completed` au lieu d'`Error`

### Uptime Kuma inaccessible via `/status` — CrashLoopBackOff
**Symptôme :** Pod Uptime Kuma redémarre en boucle, page `/status` renvoie une erreur  
**Cause 1 :** Variable `BASE_PATH` non supportée par l'image `louislam/uptime-kuma` — la readiness probe HTTP sur `/status` échouait  
**Solution 1 :** Probe remplacée par `tcpSocket` sur le port 3001  
**Cause 2 :** L'ingress transmettait `/status/...` au pod sans réécriture — Uptime Kuma ne sert que sur `/`  
**Solution 2 :** Annotation `rewrite-target: /$2` + paths regex (`/status(/|$)(.*)`) dans `ingress.yaml` — l'ingress réécrit le chemin avant transmission au pod

---

## URLs

| Environnement | URL |
|---------------|-----|
| Production | http://pokemon.portfolio-kdiochon.fr |
| API (prod) | http://pokemon.portfolio-kdiochon.fr/api/users |
| Uptime Kuma | http://pokemon.portfolio-kdiochon.fr/status |
| Dev local | http://localhost:5173 (frontend) + http://localhost:8000 (backend) |
