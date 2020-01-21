#!/bin/bash

RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Linting..."
npm run eslint

rc=$?;
if [[ $rc != 0 ]]
then
  echo -e "\n${RED}Linting not successful.${NC}"
fi
exit $rc