#!/bin/sh
set -e

# Charger les variables depuis .env
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
set -a
. "$SCRIPT_DIR/.env"
set +a

echo "Registry : $REGISTRY"

# Build et push des images (--no-cache + --platform pour eviter les problemes ARM/amd64)
echo "Build et push de l'image backend..."
cd "$SCRIPT_DIR/../backend"
docker build --no-cache --platform linux/amd64 -f Dockerfile -t ${REGISTRY}/pokemon-backend:latest .
docker push ${REGISTRY}/pokemon-backend:latest

echo "Build et push de l'image frontend..."
cd "$SCRIPT_DIR/../frontend"
docker build --no-cache --platform linux/amd64 -f Dockerfile -t ${REGISTRY}/pokemon-frontend:latest .
docker push ${REGISTRY}/pokemon-frontend:latest

cd "$SCRIPT_DIR"

# S'assurer du bon cluster Kubernetes
export KUBECONFIG=~/kube/kyllian/pck-n48nwgo-kubeconfig

# Appliquer les manifests
kubectl apply -f "$SCRIPT_DIR/namespace.yaml"
kubectl apply -f "$SCRIPT_DIR/secrets.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/deployment.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/configmap.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/pvc.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/service-headless.yaml"
kubectl apply -f "$SCRIPT_DIR/mariadb/service.yaml"

echo "Attente que MariaDB soit pret..."
kubectl rollout status statefulset/mariadb -n pokemon --timeout=240s

# Migrations Doctrine (tolerant au timeout)
echo "Lancement des migrations Doctrine..."
kubectl delete job doctrine-migrations -n pokemon --ignore-not-found
envsubst < "$SCRIPT_DIR/backend/migration-job.yaml" | kubectl apply -f -

echo "Attente des migrations (max 3 min)..."
if kubectl wait --for=condition=complete job/doctrine-migrations -n pokemon --timeout=180s; then
  echo "Migrations terminees avec succes."
else
  echo "Timeout migrations -- verification du statut reel..."
  JOB_STATUS=$(kubectl get job doctrine-migrations -n pokemon -o jsonpath='{.status.conditions[?(@.type=="Failed")].type}' 2>/dev/null || echo "")
  if [ "$JOB_STATUS" = "Failed" ]; then
    echo "Les migrations ont echoue. Logs :"
    kubectl logs -n pokemon -l job-name=doctrine-migrations --tail=50
    exit 1
  else
    echo "Job toujours en cours ou termine sans condition explicite, on continue..."
  fi
fi

envsubst < "$SCRIPT_DIR/backend/deployment.yaml"  | kubectl apply -f -
kubectl apply -f "$SCRIPT_DIR/backend/service.yaml"
envsubst < "$SCRIPT_DIR/frontend/deployment.yaml" | kubectl apply -f -
kubectl apply -f "$SCRIPT_DIR/frontend/service.yaml"
kubectl apply -f "$SCRIPT_DIR/uptime-kuma/"
kubectl apply -f "$SCRIPT_DIR/headlamp/headlamp.yaml"
kubectl apply -f "$SCRIPT_DIR/ingress.yaml"

# Forcer le redemarrage des pods pour charger les nouvelles images
echo "Redemarrage des pods frontend et backend..."
kubectl rollout restart deployment/frontend deployment/backend -n pokemon

echo "Attente que le frontend soit pret..."
kubectl rollout status deployment/frontend -n pokemon --timeout=120s

echo ""
echo "Deploiement termine avec succes."
kubectl get pods -n pokemon
