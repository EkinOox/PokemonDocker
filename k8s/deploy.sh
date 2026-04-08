#!/bin/sh
set -e

# Charger les variables depuis .env
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
set -a
. "$SCRIPT_DIR/.env"
set +a

echo "Registry : $REGISTRY"

# S'assurer du bon cluster Kubernetes
export KUBECONFIG=~/kube/kyllian/pck-n48nwgo-kubeconfig

# Appliquer les manifests (envsubst remplace ${REGISTRY} dans les fichiers)
kubectl apply -f "$SCRIPT_DIR/namespace.yaml"
kubectl apply -f "$SCRIPT_DIR/secrets.yaml"
# N'applique que les manifests KMl valides (évite replication-values.yaml non-manifest)
kubectl apply -f "$SCRIPT_DIR/mariadb/deployment.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/configmap.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/pvc.yaml"

# Assurer l’ordre et la création de volumes pour le StatefulSet
kubectl apply -f "$SCRIPT_DIR/mariadb/service-headless.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/service.yaml"

echo "Attente que MariaDB soit prêt..."
kubectl rollout status statefulset/mariadb -n pokemon --timeout=240s

# Factor XII : migrations comme job one-off avant le démarrage du backend
echo "Lancement des migrations Doctrine..."
# Au cas où le job existe déjà, on le supprime pour forcer l'exécution à chaque run
kubectl delete job doctrine-migrations -n pokemon --ignore-not-found
envsubst < "$SCRIPT_DIR/backend/migration-job.yaml" | kubectl apply -f -
kubectl wait --for=condition=complete job/doctrine-migrations -n pokemon --timeout=120s

envsubst < "$SCRIPT_DIR/backend/deployment.yaml"  | kubectl apply -f -
kubectl apply -f "$SCRIPT_DIR/backend/service.yaml"
envsubst < "$SCRIPT_DIR/frontend/deployment.yaml" | kubectl apply -f -
kubectl apply -f "$SCRIPT_DIR/frontend/service.yaml"
kubectl apply -f "$SCRIPT_DIR/uptime-kuma/"
# Headlamp UI pour debug k8s
kubectl apply -f "$SCRIPT_DIR/headlamp/headlamp.yaml"
kubectl apply -f "$SCRIPT_DIR/ingress.yaml"

echo "Déploiement terminé."
kubectl get pods -n pokemon
