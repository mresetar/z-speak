#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v hugo >/dev/null 2>&1; then
  echo "hugo not found on PATH — install it (e.g. 'brew install hugo')" >&2
  exit 1
fi

python3 tools/check.py content/terms

exec hugo server -D
