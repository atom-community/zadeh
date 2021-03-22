cmake_minimum_required(VERSION 3.17)

project(zadeh VERSION "2.0.2" LANGUAGES CXX)

add_executable(example1 ./examples/example1.cpp)
target_compile_features(example1 PRIVATE cxx_std_17)
