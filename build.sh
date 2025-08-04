#!/bin/bash
set -e

echo "Step 1: Autogenerating bindings..."
python3 src/parse_mjxmacro.py

echo "Step 2: Building the mujoco_wasm binary with CMake and Emscripten..."
rm -rf build
emcmake cmake -B build
cmake --build build

echo "Build complete. Artifacts are in the dist/ directory."
echo "You can now copy the 'dist' directory into your SvelteKit project's 'src/lib'."
