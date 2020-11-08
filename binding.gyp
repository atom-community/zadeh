# Note: C++ standard is repeated in configurations multiple times for different configurations
{
  "targets": [{
      "target_name": "fuzzaldrinplusfast",
      "sources": [ "src/fuzzaldrin.cc", "src/scorer.cc", "src/path_scorer.cc", "src/filter.cc", "src/query.cc", "src/matcher.cc",  "src/tree.h" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      # Compiler flags:
      'default_configuration': 'Release',
      'configurations': {
        # Release Settings
        'Release': {
          'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
          "cflags": [ "-fno-exceptions", '-O3' ],
          "cflags_cc": [ "-fno-exceptions",  "-std=c++2a" ],
          "xcode_settings": {
            'GCC_OPTIMIZATION_LEVEL': '3', # stop gyp from defaulting to -Os
            "CLANG_CXX_LIBRARY": "libc++",
            "CLANG_CXX_LANGUAGE_STANDARD":"c++2a",
            'MACOSX_DEPLOYMENT_TARGET': '10.15'
          },
          "msvs_settings": {
            "VCCLCompilerTool": {
              'ExceptionHandling': 0,               # /EHsc
              'MultiProcessorCompilation': 'true',
              'StringPooling': 'true',              # pool string literals
              "AdditionalOptions": [
                # C++ standard
                "/std:c++latest",
              ],
              'EnableFunctionLevelLinking': 'true',
              'EnableIntrinsicFunctions': 'true',
              'FavorSizeOrSpeed': 1,          # /Ot, favor speed over size
              'InlineFunctionExpansion': 2,   # /Ob2, inline anything eligible
              'OmitFramePointers': 'true',
              'Optimization': 3,              # /Ox, full optimization
              'RuntimeTypeInfo': 'false',
            }
          "msvs_settings": {
            "VCCLCompilerTool": {
            },
}
