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
  CURRENT_DIR="$(dirname "$0")"
  source "$CURRENT_DIR/ci-setup-google-cloud.sh"
fi

cd backend

echo "Pulling cache"

docker pull eu.gcr.io/moocfi/moocfi-backend:latest || true

echo Building "$TAG"

docker build . --cache-from eu.gcr.io/moocfi/moocfi-backend:latest -f Dockerfile -t "$TAG" --build-arg=GIT_COMMIT="$(git rev-parse --short HEAD)"

echo "Successfully built image: $TAG"

echo "Copying source map from container to host"
docker create -ti --name tmpcontainer "$TAG" sh
docker cp tmpcontainer:/app/sourcemap sourcemap
docker rm -f tmpcontainer

echo "Source map copied from container!"

cd ..
