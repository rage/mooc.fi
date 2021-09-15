#!/bin/bash
set -eo pipefail

DATE=$(date +%s)

if [ -n "$CIRCLE_SHA1" ]; then
  echo "Running in Circle CI"
  REV="$CIRCLE_WORKFLOW_ID-$(git rev-parse --verify HEAD)"

  CIRCLE_PR_NUMBER=${CIRCLE_PR_NUMBER:=${CIRCLE_PULL_REQUEST##*/}} 
  echo "Checking if we are a pull request"
  if [ -n "$CIRCLE_PR_NUMBER" ]; then
    echo "We are pull request #$CIRCLE_PR_NUMBER"
    echo "Project info $CIRCLE_PROJECT_USERNAME $CIRCLE_PROJECT_REPONAME"
    URL="https://api.github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/pulls/$CIRCLE_PR_NUMBER?access_token=$GITHUB_TOKEN"
    echo "Trying to get the base branch with $URL"
    BASE_BRANCH=$(curl -fsSL $URL | jq -r '.base.ref')
    echo "We're on $CIRCLE_BRANCH and our base branch is $BASE_BRANCH"
    if [ -n "$BASE_BRANCH" ] && [ $CIRCLE_BRANCH != $BASE_BRANCH ]; then
      JEST_OPTIONS="--baseBranch $BASE_BRANCH --targetBranch $CIRCLE_BRANCH"
    fi
  fi
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
  /bin/bash -c "npm run create-test-db; npm run test -- $JEST_OPTIONS --ci --coverage --reporters=default --reporters=jest-junit" 

echo "Copying coverage metadata"

docker cp "$TEST_NAME":/app/coverage coverage
docker rm "$TEST_NAME"

cd ..