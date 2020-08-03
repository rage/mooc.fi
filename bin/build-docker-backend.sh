#!/bin/bash
set -eo pipefail

DATE=$(date +%s)

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Running in Circle CI"
  REV="$CIRCLE_WORKFLOW_ID-$(git rev-parse --verify HEAD)"
else
  echo "Running outside CI"
  REV="$DATE-$(git rev-parse --verify HEAD)"
fi

TAG="eu.gcr.io/moocfi/moocfi-backend:build-$REV"

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Trying to setup google cloud"
  source "$CURRENT_DIR/ci-setup-google-cloud.sh"
fi

cd backend

echo "Pulling cache"

docker pull eu.gcr.io/moocfi/moocfi-backend:latest || true

echo Building "$TAG"

docker build . --cache-from eu.gcr.io/moocfi/moocfi-backend:latest -f Dockerfile -t "$TAG"
cd ..

echo "Successfully built image: $TAG"
