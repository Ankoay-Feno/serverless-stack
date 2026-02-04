#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$ROOT_DIR/../src"
BUILD_DIR="$ROOT_DIR/build"
VENV_DIR="$ROOT_DIR/.venv"

if command -v docker >/dev/null 2>&1; then
  USE_DOCKER=1
else
  USE_DOCKER=0
fi

if [ "$USE_DOCKER" -eq 0 ]; then
  if command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="python3"
  elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
  else
    echo "Error: python not found. Install Python 3.x first." >&2
    exit 1
  fi
fi

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

if [ "$USE_DOCKER" -eq 1 ]; then
  docker run --rm \
    --user "$(id -u):$(id -g)" \
    -e HOME=/tmp \
    --entrypoint /bin/bash \
    -v "$SRC_DIR":/src \
    -v "$BUILD_DIR":/build \
    public.ecr.aws/lambda/python:3.11 \
    -c "pip install -r /src/requirements.txt -t /build >/dev/null"
  cp -R "$SRC_DIR/app" "$BUILD_DIR/app"
else
  "$PYTHON_BIN" -m venv "$VENV_DIR"
  "$VENV_DIR/bin/python" -m pip install --upgrade pip >/dev/null
  "$VENV_DIR/bin/python" -m pip install -r "$SRC_DIR/requirements.txt" -t "$BUILD_DIR" >/dev/null
  cp -R "$SRC_DIR/app" "$BUILD_DIR/app"
  echo "Warning: built without Docker. Lambda may fail on native deps like pydantic_core." >&2
fi
