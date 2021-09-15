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
  --env LD_PRELOAD=/app/node_modules/sharp/vendor/lib/libz.so \
  --env JEST_JUNIT_OUTPUT_DIR=./coverage/junit/ \
  --env PRIVATE_KEY_TEST=config/mooc-private-test.pem \
  --env PUBLIC_KEY_TEST=config/mooc-public-test.pem \
  --env AUTH_ISSUER=issuer \
  --network host \
  --name "$TEST_NAME" "$TAG" \
  /bin/bash -c "npm run create-test-db; npm run test -- --ci --coverage --reporters=default --reporters=jest-junit" 

echo "Copying coverage metadata"

docker cp "$TEST_NAME":/app/coverage coverage
docker rm "$TEST_NAME"

cd ..