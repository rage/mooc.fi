#!/bin/bash

RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Running pre-push lint checks..."
pnpm eslint-pre-push

rc=$?;
if [[ $rc != 0 ]]
then
  echo -e "\n${RED}Linting not successful.${NC}"
fi
exit $rc
