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

export IMAGE_TAG="build-$REV"

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" == "master" ]]; then
  echo "Deploying..."
  helm upgrade moocfi ./helm --set image.tag="$IMAGE_TAG" --namespace moocfi --install
fi

if [[ "$BRANCH" == "staging" ]]; then
  if [ -n "$CIRCLE_SHA1" ]; then
    echo "Removing kafka deployments in staging"
    rm -rf ./helm/templates/kafka
    echo "Removing unwanted jobs and deployments in staging"
    rm ./helm/templates/send-ai-statistics-cronjob.yml
    rm ./helm/templates/background-emailer-deployment.yml
    rm ./helm/templates/course-stats-emailer-cronjob.yml
  fi
  echo "Deploying staging..."
 
  helm upgrade moocfi ./helm --set image.tag="$IMAGE_TAG" --namespace moocfi-staging --install -f helm/values.staging.yaml
fi