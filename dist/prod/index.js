// Import the raw Emscripten-generated module factory
import load_mujoco from "./mujoco_wasm.js";

// This is the magic line for asset handling.
// It creates a URL reference that Vite/Webpack will replace
// with the final, hashed path to the asset during the build process.
const wasmUrl = new URL('./mujoco_wasm.wasm', import.meta.url).href;

let mujocoPromise = null;

/**
 * Asynchronously loads and and initializes the MuJoCo Wasm module.
 * This function is safe to call on both the server and the client.
 * It ensures the module is only initialized once.
 *
 * @returns {Promise<object|null>} A promise that resolves to the initialized
 *   MuJoCo module on the client, or null on the server.
 */
export default function loadMujoco() {
  // 1. SSR Guard: If we're not in a browser, don't even try.
  //    Return a promise that resolves to null.
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  // 2. Singleton Guard: If we're already initializing, return the existing promise.
  if (mujocoPromise) {
    return mujocoPromise;
  }

  // 3. Initialize the module.
  mujocoPromise = load_mujoco({
    // Provide the URL to the wasm file. Because of our Emscripten flags
    // and the wasmUrl line above, this might be redundant for Vite,
    // but it's a robust fallback for other bundlers.
    locateFile: () => wasmUrl,
  });

  return mujocoPromise;
}
