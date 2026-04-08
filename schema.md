# Kubernetes architecture détaillée (PokemonDocker)

## Objectif
Ce diagramme Mermaid décrit toute l’infrastructure Kubernetes du projet : cluster, namespace, pods, services, ingress, rôles et principaux flux réseau.
Le but est qu’un lecteur qui découvre le projet comprenne le système sans autre documentation.

---

## Légende
- 🟦 Control Plane (API Server / etcd / Scheduler / Controller Manager)
- 🟩 Accès externe (Ingress, navigateur)
- 🟨 Applications (frontend, backend, DB)
- 🟪 Admin & monitoring (Headlamp)
- 🟥 IAM / RBAC (ServiceAccount / ClusterRoleBinding)

---

## Diagramme Mermaid simplifié

```mermaid
flowchart TD
    User[ Utilisateur<br/>Navigateur] --> Ingress[ Ingress<br/>nginx/traefik]

    Ingress --> Frontend[ Frontend<br/>React/Vite]
    Ingress --> Backend[ Backend<br/>Symfony API]
    Ingress --> Headlamp[ Headlamp<br/>UI Admin]

    Frontend --> Backend
    Backend --> DB[( MariaDB<br/>Base de données)]

    Headlamp --> API[ API Server]

    subgraph "Control Plane"
        API --> etcd[( etcd<br/>Stockage état)]
        API --> Scheduler[ Scheduler<br/>Planification pods]
        API --> Controller[ Controller Manager<br/>Réconciliation]
    end

    Scheduler -.-> Frontend
    Scheduler -.-> Backend
    Scheduler -.-> DB
    Scheduler -.-> Headlamp

    classDef app fill:#e3f2fd,stroke:#1976d2,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef control fill:#e8f5e8,stroke:#388e3c,stroke-width:2px;
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px;

    class User,Ingress external;
    class Frontend,Backend,Headlamp app;
    class DB db;
    class API,Scheduler,Controller control;
```

---

## Diagramme Mermaid détaillé

Ce diagramme inclut tous les pods, déploiements, services, ingress, et composants de monitoring présents dans le projet (basé sur les fichiers YAML dans `k8s/`).

```mermaid
flowchart LR
    subgraph "Externe"
        User[ Utilisateur<br/>Navigateur]
    end

    subgraph "Ingress & Routing"
        Ingress[ Ingress<br/>nginx/traefik<br/>ingress.yaml]
    end

    subgraph "Applications"
        FrontendSvc[ Service Frontend<br/>frontend/service.yaml] --> FrontendPod[ Pod Frontend<br/>React/Vite<br/>frontend/deployment.yaml]
        BackendSvc[ Service Backend<br/>backend/service.yaml] --> BackendPod[ Pod Backend<br/>Symfony API<br/>backend/deployment.yaml]
        FrontendPod --> BackendSvc
    end

    subgraph "Base de données"
        DBSvc[ Service MariaDB<br/>mariadb/service.yaml] --> DBPod[ Pod MariaDB<br/>Base de données<br/>mariadb/deployment.yaml<br/>+ PVC mariadb/pvc.yaml]
        BackendPod --> DBSvc
        MigrationJob[ Job Migration<br/>backend/migration-job.yaml] --> DBSvc
    end

    subgraph "Monitoring"
        PrometheusPod[ Pod Prometheus<br/>Collecte métriques<br/>monitoring/servicemonitor-nginx.yaml]
        GrafanaSvc[ Service Grafana<br/>monitoring/ingress-grafana.yaml] --> GrafanaPod[ Pod Grafana<br/>Visualisation<br/>monitoring/grafana-dashboard-pokemon.yaml]
        UptimeKumaSvc[ Service Uptime-Kuma<br/>uptime-kuma/service.yaml] --> UptimeKumaPod[ Pod Uptime-Kuma<br/>Monitoring Uptime<br/>uptime-kuma/deployment.yaml]
        PrometheusPod --> BackendPod
        PrometheusPod --> FrontendPod
        PrometheusPod --> DBPod
        GrafanaPod --> PrometheusPod
        UptimeKumaPod --> BackendSvc
        UptimeKumaPod --> FrontendSvc
    end

    subgraph "Administration"
        HeadlampSvc[ Service Headlamp<br/>headlamp/headlamp.yaml] --> HeadlampPod[ Pod Headlamp<br/>UI Admin<br/>headlamp/headlamp.yaml]
        HeadlampPod --> API[ API Server<br/>Control Plane]
    end

    subgraph "Control Plane"
        API --> etcd[( etcd<br/>Stockage état)]
        API --> Scheduler[ Scheduler<br/>Planification pods]
        API --> Controller[ Controller Manager<br/>Réconciliation]
    end

    subgraph "Ressources partagées"
        Secrets[ Secrets<br/>secrets.yaml]
        ConfigMap[ ConfigMap<br/>mariadb/configmap.yaml]
        PVC[ Persistent Volume Claims<br/>mariadb/pvc.yaml<br/>uptime-kuma/pvc.yaml]
    end

    User --> Ingress
    Ingress --> FrontendSvc
    Ingress --> BackendSvc
    Ingress --> HeadlampSvc
    Ingress --> GrafanaSvc
    Ingress --> UptimeKumaSvc

    Scheduler -.-> FrontendPod
    Scheduler -.-> BackendPod
    Scheduler -.-> DBPod
    Scheduler -.-> HeadlampPod
    Scheduler -.-> GrafanaPod
    Scheduler -.-> UptimeKumaPod
    Scheduler -.-> PrometheusPod

    Secrets --> BackendPod
    Secrets --> DBPod
    ConfigMap --> DBPod
    PVC --> DBPod
    PVC --> UptimeKumaPod

    classDef app fill:#e3f2fd,stroke:#1976d2,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef control fill:#e8f5e8,stroke:#388e3c,stroke-width:2px;
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
    classDef monitoring fill:#fff8e1,stroke:#ffb74d,stroke-width:2px;
    classDef shared fill:#f1f8e9,stroke:#689f38,stroke-width:2px;

    class User,Ingress external;
    class FrontendPod,BackendPod,HeadlampPod app;
    class DBPod db;
    class API,Scheduler,Controller control;
    class PrometheusPod,GrafanaPod,UptimeKumaPod monitoring;
    class Secrets,ConfigMap,PVC shared;
```

---

## Déroulé et explications détaillées
- **Pods et Déploiements** : Chaque application est déployée via des pods (conteneurs orchestrés par Kubernetes). Par exemple, le Backend a un déploiement avec des pods Symfony, le Frontend avec React/Vite.
- **Services** : Exposent les pods à l'intérieur du cluster (par exemple, le service Backend permet au Frontend de l'appeler).
- **Ingress** : Route le trafic externe vers les services appropriés.
- **Monitoring** : Prometheus collecte des métriques des pods, Grafana les visualise, Uptime-Kuma vérifie la disponibilité.
- **Job** : Le Migration Job exécute des migrations de base de données au démarrage.
- **Ressources partagées** : Secrets pour les mots de passe, ConfigMap pour les configs, PVC pour le stockage persistant.
- **Control Plane** : Gère l'orchestration de tous les pods.

Les flèches montrent les connexions réseau, les dépendances et les interactions (par exemple, Prometheus collecte depuis les pods).
- **Utilisateur** : Accès via navigateur web
- **Ingress** : Point d'entrée du trafic externe, redirige vers les applications
- **Frontend** : Interface utilisateur React/Vite
- **Backend** : API Symfony qui traite les requêtes
- **MariaDB** : Base de données pour stocker les données
- **Headlamp** : Interface d'administration Kubernetes
- **Control Plane** : Cœur de Kubernetes (API Server, etcd, Scheduler, Controller Manager)

Les flèches montrent les connexions réseau et les dépendances entre composants.

---

## Commandes de vérification
- `kubectl get pods -n pokemon -o wide`
- `kubectl get svc -n pokemon`
- `kubectl describe ingress -n pokemon`
- `kubectl describe deployment headlamp -n pokemon`
- `kubectl logs -n pokemon -l app=headlamp --tail=50`
- `kubectl rollout status deployment/headlamp -n pokemon`
