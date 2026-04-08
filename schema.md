# Kubernetes architecture détaillée (PokemonDocker)

## 🎯 Objectif
Ce diagramme Mermaid décrit toute l’infrastructure Kubernetes du projet : cluster, namespace, pods, services, ingress, rôles et principaux flux réseau.
Le but est qu’un lecteur qui découvre le projet comprenne le système sans autre documentation.

---

## 🧩 Légende
- 🟦 Control Plane (API Server / etcd / Scheduler / Controller Manager)
- 🟩 Accès externe (Ingress, navigateur)
- 🟨 Applications (frontend, backend, DB)
- 🟪 Admin & monitoring (Headlamp)
- 🟥 IAM / RBAC (ServiceAccount / ClusterRoleBinding)

---

## 🌐 Diagramme Mermaid complet

```mermaid
flowchart TB
  classDef controlPlane fill:#cfe2ff,stroke:#2f6fdb,stroke-width:2px,color:#0d3c61;
  classDef external fill:#d1e7dd,stroke:#1f7d44,stroke-width:2px,color:#0f5132;
  classDef app fill:#fff3cd,stroke:#ffcc00,stroke-width:2px,color:#664d03;
  classDef admin fill:#e2e3e5,stroke:#6c757d,stroke-width:2px,color:#343a40;
  classDef rbac fill:#fde2e2,stroke:#dc3545,stroke-width:2px,color:#842029;

  subgraph ControlPlane[Control plane]:::controlPlane
    api["API Server\nkube-apiserver"]:::controlPlane
    etcd["etcd\nstore état cluster"]:::controlPlane
    scheduler["Scheduler\nplanification pods"]:::controlPlane
    controller["Controller Manager\nreconcilation"]:::controlPlane
  end

  api --> etcd
  api --> scheduler
  api --> controller

  subgraph NamespacePokemon[Namespace: pokemon]
    direction LR

    user["Utilisateur\n(navigateur)"]:::external
    ingress["Ingress\n(nginx/traefik)\npokemon-ingress"]:::external

    subgraph Services[Services (ClusterIP)]
      direction TB
      frontendSvc["Service\nfrontend"]:::app
      backendSvc["Service\nbackend"]:::app
      mariadbSvc["Service\nmariadb"]:::app
      headlampSvc["Service\nheadlamp"]:::admin
    end

    subgraph Pods[Pods déployés]
      direction TB
      frontendPod["Pod frontend\nimage: pokemon-frontend:latest\nvite react"]:::app
      backendPod["Pod backend\nimage: pokemon-backend:latest\nSymfony API"]:::app
      mariadbPod["Pod mariadb\nimage: mariadb:10.9\nPVC: data-mariadb"]:::app
      headlampPod["Pod headlamp\nimage: ghcr.io/loft-sh/headlamp:v0.13.0\nSA: headlamp\nRole: cluster-admin"]:::admin
    end

    user --> ingress
    ingress --> frontendSvc
    ingress --> backendSvc
    ingress --> headlampSvc

    frontendSvc --> frontendPod
    backendSvc --> backendPod
    mariadbSvc --> mariadbPod
    headlampSvc --> headlampPod

    frontendPod --> backendSvc
    backendPod --> mariadbSvc
    headlampPod --> api
  end

  subgraph IAM[ IAM / RBAC ]
    sa["ServiceAccount\nheadlamp"]:::rbac
    crb["ClusterRoleBinding\nheadlamp-cluster-admin"]:::rbac
  end

  sa --> crb
  crb --> headlampPod

  api -.-> kubeconfig["Cluster auth\nconfig e.g. KUBECONFIG"]
  etcd -.-> kubeconfig

  scheduler --> frontendPod
  scheduler --> backendPod
  scheduler --> mariadbPod
  scheduler --> headlampPod
```

---

## 📘 Déroulé et explications
- `Ingress` reçoit le trafic externe et le redirige vers `frontend`, `backend` ou `headlamp`.
- `frontend` est l’UI React déployée via `frontend` service/pod.
- `backend` est l’API Symfony exposée via `backend` service/pod.
- `mariadb` est la base de données StatefulSet (PVC) accessible depuis `backend`.
- `headlamp` est l’UI d’observation et de gestion du cluster avec autorisations `cluster-admin`.
- `Control plane` orchestre l’ensemble et stocke l’état dans `etcd`.

---

## 🧹 Commandes de vérification
- `kubectl get pods -n pokemon -o wide`
- `kubectl get svc -n pokemon`
- `kubectl describe ingress -n pokemon`
- `kubectl describe deployment headlamp -n pokemon`
- `kubectl logs -n pokemon -l app=headlamp --tail=50`
- `kubectl rollout status deployment/headlamp -n pokemon`
