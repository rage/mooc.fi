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
TEST_NAME="test-$REV-$DATE"

cd backend

echo "Running tests"

docker run --env NODE_ENV=test --env PGPASSWORD=prisma \
  --env JEST_JUNIT_OUTPUT_DIR=./coverage/junit/ \
  --network host \
  --name "$TEST_NAME" "$TAG" \
  /bin/bash -c "pnpm run create-test-db; pnpm run test --ci --coverage --reporters=default --reporters=jest-junit" 

echo "Copying coverage metadata"

docker cp "$TEST_NAME":/app/backend/coverage coverage
docker rm "$TEST_NAME"

cd ..