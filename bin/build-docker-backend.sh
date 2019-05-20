#!/bin/bash
set -euo pipefail

REV=$(git rev-parse --verify HEAD)
DATE=$(date +%s)
TAG="gcr.io/moocfi/moocfi-backend:build-$DATE-$REV"
echo Building "$TAG"

cd backend

docker build . -f Dockerfile -t "$TAG"

echo "export QUIZZES_BACKEND_IMAGE=$TAG"
export QUIZZES_BACKEND_IMAGE=$TAG

cd ..
