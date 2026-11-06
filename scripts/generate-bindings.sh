#!/usr/bin/env bash
# Generate a TypeScript client for one built Soroban contract.
#
# Usage: ./scripts/generate-bindings.sh <wasm-name>
#   e.g. ./scripts/generate-bindings.sh bytechain_hello_world
#
# Run `stellar contract build` first. Output goes to
# packages/ts-bindings/bindings/<wasm-name>/.
set -euo pipefail

name="${1:?usage: $0 <wasm-name>}"
root="$(cd "$(dirname "$0")/.." && pwd)"
wasm="$root/target/wasm32v1-none/release/${name}.wasm"
out="$root/packages/ts-bindings/bindings/${name}"

if [[ ! -f "$wasm" ]]; then
  echo "error: $wasm not found. Run 'stellar contract build' first." >&2
  exit 1
fi

stellar contract bindings typescript \
  --wasm "$wasm" \
  --output-dir "$out" \
  --overwrite

echo "Bindings written to $out"
