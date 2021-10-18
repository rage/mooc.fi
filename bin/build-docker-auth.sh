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

TAG="eu.gcr.io/moocfi/moocfi-auth:build-$REV"

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Trying to setup google cloud"
  CURRENT_DIR="$(dirname "$0")"
  source "$CURRENT_DIR/ci-setup-google-cloud.sh"
fi

cd auth

echo "Pulling cache"

docker pull eu.gcr.io/moocfi/moocfi-auth:latest || true

echo Building "$TAG"

docker build . --cache-from eu.gcr.io/moocfi/moocfi-auth:latest -f Dockerfile -t "$TAG" --build-arg=GIT_COMMIT="$(git rev-parse --short HEAD)"

echo "Successfully built image: $TAG"

cd ..