#!/bin/sh
set -e

# Charger les variables depuis .env
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
set -a
. "$SCRIPT_DIR/.env"
set +a

echo "Registry : $REGISTRY"

# Appliquer les manifests (envsubst remplace ${REGISTRY} dans les fichiers)
kubectl apply -f "$SCRIPT_DIR/namespace.yaml"
kubectl apply -f "$SCRIPT_DIR/secrets.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/"
envsubst < "$SCRIPT_DIR/backend/deployment.yaml"  | kubectl apply -f -
kubectl apply -f "$SCRIPT_DIR/backend/service.yaml"
envsubst < "$SCRIPT_DIR/frontend/deployment.yaml" | kubectl apply -f -
kubectl apply -f "$SCRIPT_DIR/frontend/service.yaml"
kubectl apply -f "$SCRIPT_DIR/ingress.yaml"

echo "Déploiement terminé."
kubectl get pods -n pokemon
