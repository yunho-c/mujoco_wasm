add_executable(mujoco_wasm main.genned.cc)

target_compile_options(mujoco_wasm PRIVATE -pthread)

# Emscripten-specific linker flags
set(EMCC_LINKER_FLAGS
    "-s ASSERTIONS=1"
    "--bind"
    "-s ALLOW_MEMORY_GROWTH=1"
    "-s EXPORT_ES6=1"
    "-s MODULARIZE=1"
    "-s FORCE_FILESYSTEM=1"
    "-s EXPORTED_RUNTIME_METHODS=['FS','MEMFS']"
    "-s EXPORT_NAME=load_mujoco"
    "-s EXCEPTION_CATCHING_ALLOWED=['load_from_xml']"
    "-sSUPPORT_LONGJMP"
    # "-sEXPORTED_FUNCTIONS=['_saveSetjmp','_testSetjmp']"
)

target_link_options(mujoco_wasm PRIVATE ${EMCC_LINKER_FLAGS})

target_include_directories(mujoco_wasm PRIVATE ${MUJOCO_INSTALL_INCLUDE_DIR})
target_link_directories(mujoco_wasm PRIVATE ${MUJOCO_INSTALL_LIB_DIR})
target_link_libraries(mujoco_wasm PRIVATE ccd elasticity lodepng mujoco tinyxml2 qhullstatic_r)

# The CMAKE_RUNTIME_OUTPUT_DIRECTORY in the parent CMakeLists.txt handles this for builds.
# The install command is for packaging/installing the project.
include(GNUInstallDirs)
install(TARGETS mujoco_wasm
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
