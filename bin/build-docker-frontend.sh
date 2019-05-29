#!/bin/bash
set -euo pipefail

REV=$(git rev-parse --verify HEAD)
DATE=$(date +%s)
TAG="gcr.io/moocfi/moocfi-frontend:build-$DATE-$REV"
echo Building "$TAG"

cd frontend

docker build . -f Dockerfile -t "$TAG"

echo "export FRONTEND_IMAGE=$TAG"
export FRONTEND_IMAGE=$TAG

cd ..
