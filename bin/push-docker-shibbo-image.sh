#!/bin/bash
set -eo pipefail

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" != "master" && "$BRANCH" != "staging" ]]; then
  exit 0
fi

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

TAG="eu.gcr.io/moocfi/shibbo-test:build-$REV"

docker tag "$TAG" eu.gcr.io/moocfi/shibbo-test:latest

echo "Pushing image $TAG"

docker push "$TAG"

echo "Pushing latest"
docker push eu.gcr.io/moocfi/shibbo-test:latest
