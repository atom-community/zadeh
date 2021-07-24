cmake_minimum_required(VERSION 3.17)
project(zadeh VERSION "2.0.2" LANGUAGES CXX)

# .node file target

# source files
add_library(${PROJECT_NAME} SHARED "./src/binding/node.cc")
# include paths
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})

target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# linking libs
target_link_libraries(${PROJECT_NAME} PRIVATE ${CMAKE_JS_LIB})
