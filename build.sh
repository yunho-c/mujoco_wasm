#!/bin/bash
set -e

echo "Step 1: Autogenerating bindings..."
python3 src/parse_mjxmacro.py

echo "Step 2: Building the mujoco_wasm binary with CMake and Emscripten..."
mkdir -p build
cd build
emcmake cmake ..
make
cd ..

echo "Step 3: Moving build artifacts to the dist/ directory..."
mkdir -p dist
cp build/mujoco_wasm.js dist/
cp build/mujoco_wasm.wasm dist/
# The .d.ts file is already placed in dist by the python script.

echo "Build complete. Artifacts are in the dist/ directory."
echo "You can now copy the 'dist' directory into your SvelteKit project's 'src/lib'."
