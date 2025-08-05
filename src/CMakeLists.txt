cmake_minimum_required(VERSION 3.2)
project(mujoco_wasm)

set(SOURCE_FILES main.genned.cc)
add_compile_options(-pthread)
set(EMCC_LINKER_FLAGS_LIST
  -s ASSERTIONS=1
  --bind
  -s ALLOW_MEMORY_GROWTH=1
  -s EXPORT_ES6=1
  -s MODULARIZE=1
  -s ENVIRONMENT=web,worker
  -s USE_ES6_IMPORT_META=1
  -s FORCE_FILESYSTEM=1
  -s EXPORT_NAME=load_mujoco
  -s DISABLE_EXCEPTION_CATCHING=0 # Enable full C++ exception handling to be caught by JS
  -gsource-map # Add full debug information and source maps
  -s "EXPORTED_RUNTIME_METHODS=['FS','MEMFS','getExceptionMessage']" # Export the filesystem methods AND the exception helper
  # -s EXCEPTION_CATCHING_ALLOWED=['load_from_xml']  # Temporarily disabled for debugging
)
string(REPLACE ";" " " EMCC_LINKER_FLAGS "${EMCC_LINKER_FLAGS_LIST}")

set(CMAKE_REQUIRED_FLAGS "${EMCC_LINKER_FLAGS}")
add_executable(mujoco_wasm ${SOURCE_FILES})
set_target_properties(mujoco_wasm PROPERTIES LINK_FLAGS "${EMCC_LINKER_FLAGS}")

target_link_libraries(mujoco_wasm ccd elasticity lodepng mujoco tinyxml2 qhullstatic_r)
install(TARGETS mujoco_wasm DESTINATION ${DIVISIBLE_INSTALL_BIN_DIR})
