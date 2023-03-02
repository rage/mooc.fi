#!/bin/bash
set -eo pipefail
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

if [[ -z "$DB_HOST" || -z "$DB_PORT" || -z "$DATABASE_URL" ]]; then
  echo "DB_HOST, DB_PORT and DATABASE_URL must be set"
  exit 1
fi

echo "Wait for database"
dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 1m

echo "Create extensions"

CREATE_EXTENSION_COMMANDS=""
while IFS= read -r extension
do
  [ ! -z "$extension" ] && CREATE_EXTENSION_COMMANDS="$CREATE_EXTENSION_COMMANDS CREATE EXTENSION IF NOT EXISTS \"$extension\";"
done < "$SCRIPTPATH/../db/extensions"

echo "Extensions: $CREATE_EXTENSION_COMMANDS"
#CREATE_EXTENSION_COMMANDS="CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"; \
#                           CREATE EXTENSION IF NOT EXISTS \"pg_trgm\"; \
#                           CREATE EXTENSION IF NOT EXISTS \"btree_gin\";"

psql $DATABASE_URL -c "$CREATE_EXTENSION_COMMANDS"

echo "Test database ready"