#/bin/bash
set -euo pipefail

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
  echo "Not on master branch, exiting"
  exit 0
fi

GIT_COMMIT_HASH=$(git rev-parse --short HEAD) 
SENTRY_RELEASE="moocfi-backend@$GIT_COMMIT_HASH"
SENTRY_PROJECT="moocfi"
SENTRY_ORG="moocfi"

cd backend

npx @sentry/cli releases --org $SENTRY_ORG new $SENTRY_RELEASE --project $SENTRY_PROJECT
npx @sentry/cli releases --org $SENTRY_ORG -p $SENTRY_PROJECT files $SENTRY_RELEASE upload-sourcemaps ./sourcemap
npx @sentry/cli releases --org $SENTRY_ORG finalize $SENTRY_RELEASE

cd ..

echo "Created Sentry release $SENTRY_RELEASE"