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

TAG="eu.gcr.io/moocfi/moocfi-frontend:build-$REV"

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Trying to setup google cloud"
  CURRENT_DIR="$(dirname "$0")"
  source "$CURRENT_DIR/ci-setup-google-cloud.sh"
fi

echo "Remove static files only used in development"

rm -rf frontend/public/images/courseimages

echo "Pulling cache"

docker pull eu.gcr.io/moocfi/moocfi-frontend:latest || true

echo Building "$TAG"

docker build . --cache-from eu.gcr.io/moocfi/moocfi-frontend:latest -f frontend/Dockerfile -t "$TAG" --load --progress=plain 

echo "Exporting next cache from the build stage"
# The build context includes frontend/.next/cache, so it must not change before this build or
# every layer after the context copy misses the cache.
rm -rf /mnt/ramdisk/next-cache
docker build . -f frontend/Dockerfile --target next-cache --output type=local,dest=/mnt/ramdisk/next-cache --progress=plain
mkdir -p /mnt/ramdisk/frontend/.next
rm -rf /mnt/ramdisk/frontend/.next/cache
mv /mnt/ramdisk/next-cache /mnt/ramdisk/frontend/.next/cache

echo "Successfully built image: $TAG"
