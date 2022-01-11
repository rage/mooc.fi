#!/bin/bash
set -eo pipefail

cd auth

echo ""

npm ci

echo "Running tests"

JEST_JUNIT_OUTPUT_DIR=./coverage/junit/ NODE_ENV=test npm run test -- --ci --coverage --reporters=default --reporters=jest-junit

rm -rf node_modules

cd ..