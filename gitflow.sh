#!/bin/bash

# Git Branch Flow Manager
# Usage: 
#   ./gitflow.sh dev "<commit message>"
#   ./gitflow.sh [test|main]

set -e

if [ $# -eq 0 ]; then
  echo "Usage: $0 [dev|test|main]"
  exit 1
fi

ACTION=$1

case $ACTION in
  dev)
    echo ">>> Commit ke dev"
    git checkout dev
    git add .
    git commit -m "${2:-Update from dev}"
    git push origin dev
    ;;
  test)
    echo ">>> Merge dev ke test"
    git checkout test
    git merge dev --no-ff
    git push origin test
    ;;
  main)
    echo ">>> Merge test ke main"
    git checkout main
    git merge test --no-ff
    git push origin main
    ;;
  *)
    echo "Invalid option. Use dev | test | main"
    exit 1
    ;;
esac