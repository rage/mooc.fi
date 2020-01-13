#!/bin/bash
set -eo pipefail

CURRENT_DIR="$(dirname "$0")"

DATE=$(date +%s)

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Running in Circle CI"
  REV="$CIRCLE_WORKFLOW_ID-$(git rev-parse --verify HEAD)"
  source "$CURRENT_DIR/ci-setup-google-cloud.sh"
else
  echo "Running outside CI"
  REV="$DATE-$(git rev-parse --verify HEAD)"
fi

export FRONTEND_IMAGE="eu.gcr.io/moocfi/moocfi-frontend:build-$REV"
export BACKEND_IMAGE="eu.gcr.io/moocfi/moocfi-backend:build-$REV"


echo "Building new Kubernetes configs"
mkdir -p "$CURRENT_DIR/../updated-kubernetes-configs"
envsubst < "$CURRENT_DIR/../kubernetes/ingress.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/ingress.yml"
envsubst < "$CURRENT_DIR/../kubernetes/backend-deployment.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/backend-deployment.yml"
envsubst < "$CURRENT_DIR/../kubernetes/fetch-ai-completions-cronjob.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/fetch-ai-completions-cronjob.yml"
envsubst < "$CURRENT_DIR/../kubernetes/frontend-deployment.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/frontend-deployment.yml"
envsubst < "$CURRENT_DIR/../kubernetes/fetch-user-app-datum-cronjob.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/fetch-user-app-datum-cronjob.yml"
envsubst < "$CURRENT_DIR/../kubernetes/send-ai-statistics-cronjob.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/send-ai-statistics-cronjob.yml"
envsubst < "$CURRENT_DIR/../kubernetes/fetch-avoin-links-cronjob.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/fetch-avoin-links-cronjob.yml"
envsubst < "$CURRENT_DIR/../kubernetes/import-organizations-cronjob.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/import-organizations-cronjob.yml"
envsubst < "$CURRENT_DIR/../kubernetes/kafka-consumer-deployment.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/kafka-consumer-deployment.yml"
envsubst < "$CURRENT_DIR/../kubernetes/kafka/kafka-bridge-deployment.yml" > "$CURRENT_DIR/../updated-kubernetes-configs/kafka-bridge-deployment.yml"

echo "Applying changes"
kubectl replace -f "$CURRENT_DIR/../updated-kubernetes-configs"
