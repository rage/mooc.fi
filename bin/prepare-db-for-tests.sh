#!/bin/bash
set -eo pipefail

cd backend

echo "Launching services"

docker-compose up -d

attempt=0

until docker-compose exec postgres pg_isready; do
  printf '.'
  sleep 2
  attempt=$(( $attempt + 1 ))
  if [ $attempt -gt 15 ]; then
    echo "Test database not ready - too many attempts, quitting"
    exit 1
  fi
done

echo "Test database ready"

cd ..
