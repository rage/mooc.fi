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


cd backend

echo "Running tests"

docker run --env NODE_ENV=test --env PGPASSWORD=prisma \
  --env LD_PRELOAD=/app/node_modules/sharp/vendor/lib/libz.so \
  --network host \
  --name test "$TAG" \
  /bin/bash -c "npm run create-test-db; npm run test -- --runInBand --ci --coverage --reporters=default --reporters=jest-junit" 

echo "Copying coverage metadata"

docker cp test:/app/coverage coverage
docker rm test

cd ..