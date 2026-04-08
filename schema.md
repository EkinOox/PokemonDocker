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
flowchart TB
    subgraph "Namespace: pokemon"
        User[ Utilisateur] --> Ingress[ Ingress<br/>nginx/traefik]

        Ingress --> Frontend[ Frontend<br/>React/Vite]
        Ingress --> Backend[ Backend<br/>Symfony API]
        Ingress --> Headlamp[ Headlamp<br/>UI Admin]

        Frontend --> Backend
        Backend --> DB[( MariaDB<br/>Base de données)]

        Headlamp --> API[ API Server]
    end

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

## Déroulé et explications
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
