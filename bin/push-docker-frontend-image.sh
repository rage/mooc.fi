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

TAG="eu.gcr.io/moocfi/moocfi-frontend:build-$REV"

echo "Pushing image $TAG"

docker push $TAG
