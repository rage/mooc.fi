#!/bin/bash

RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Typechecking..."
cd backend
npm run typecheck
rc=$?;
if [[ $rc != 0 ]]
then
  cd ..
  echo -e "\n${RED}Backend typecheck not successful.${NC}"
  exit $rc
fi
cd ..

cd frontend
npm run typecheck

rc=$?;
if [[ $rc != 0 ]]
then
  cd ..
  echo -e "\n${RED}Frontend typecheck not successful.${NC}"
fi
cd ..
exit $rc