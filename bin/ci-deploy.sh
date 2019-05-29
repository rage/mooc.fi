#!/bin/bash
set -euo pipefail

BIN_DIR=$(dirname "$0")

echo "Building backend..."
source "$BIN_DIR/build-docker-backend.sh"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
  echo "We're not in master. Stopping here."
  exit 0
fi

echo "We are on master. We probably should deploy."
