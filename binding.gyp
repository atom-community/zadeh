# Note: C++ standard is repeated in configurations multiple times for different configurations
{
  "targets": [{
      "target_name": "zadeh",
      "sources": [
        "src/zadeh.h", "src/common.h", "src/data_interface.h",
        "src/options.h", "src/scorer.h", "src/path_scorer.h", "src/filter.h", "src/query.h", "src/matcher.h",
        "src/StringArrayFilterer.h", "src/TreeFilterer.h",
        "src/binding/node.cc", "src/binding/node.h", "src/binding/node_data_interface.h",
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      # Compiler flags:
      'default_configuration': 'Release',
      'configurations': {
        # Release Settings
        'Release': {
          'defines': [ 'Zadeh_NODE_BINDING', 'NODE_ADDON_API_DISABLE_DEPRECATED', 'NAPI_DISABLE_CPP_EXCEPTIONS', 'NDEBUG' ],
          "cflags": [ "-fno-exceptions", "-Ofast" ],
          "cflags_cc": [ "-fno-exceptions", "-Ofast", "-std=c++17" ],
          "xcode_settings": {
            'GCC_OPTIMIZATION_LEVEL': '3', # stop gyp from defaulting to -Os
            "CLANG_CXX_LIBRARY": "libc++",
            "CLANG_CXX_LANGUAGE_STANDARD":"c++17",
            'MACOSX_DEPLOYMENT_TARGET': '10.13',
            'OTHER_CFLAGS': [
              '-arch x86_64',
              '-arch arm64'
            ],
            'OTHER_LDFLAGS': [
              '-arch x86_64',
              '-arch arm64'
            ]
          },
          "msvs_settings": {
            "VCCLCompilerTool": {
              'ExceptionHandling': 0,               # /EHsc
              'MultiProcessorCompilation': 'true',
              'StringPooling': 'true',              # pool string literals
              'RuntimeTypeInfo': 'false',
              'Optimization': 4,              # full optimizations /O2  ==	/Og /Oi /Ot /Oy /Ob2 /GF /Gy
              'InlineFunctionExpansion': 3,   # stop gyp from defaulting to /Ob2
              "AdditionalOptions": [
                # C++ standard
                "/std:c++latest",

                # Optimizations
                "/Ob3",  # agressive inline
                "/GL",   # whole Program Optimization  # /LTCG is implied with /GL.
                "/DNDEBUG"  # turn off asserts
              ],
            },
            "ClCompile": {
              "LanguageStandard": "stdcpp17"
            },
          }
        },
        # Debug Settings
        'Debug': {
          'defines': [ 'Zadeh_NODE_BINDING', 'NODE_ADDON_API_DISABLE_DEPRECATED', 'DEBUG', 'NAPI_CPP_EXCEPTIONS' ],
          'cflags': [ '-g', '-O0', '-ldl' ],
          "cflags_cc": [
            '-g',
            '-ldl',
            '-fexceptions', # enable exceptions

            # C++ standard
            "-std=c++17",
            "-stdlib=libc++",

            # Clang warnings
            "-Wall",
            "-Wextra", # reasonable and standard
            "-Wshadow", # warn the user if a variable declaration shadows one from a parent context
            "-Wnon-virtual-dtor", # warn the user if a class with virtual functions has a non-virtual destructor. This helps catch hard to track down memory errors
            "-Wold-style-cast", # warn for c-style casts
            "-Wcast-align", # warn for potential performance problem casts
            "-Wunused", # warn on anything being unused
            "-Woverloaded-virtual", # warn if you overload (not override) a virtual function
            "-Wpedantic", # warn if non-standard C++ is used
            "-Wconversion", # warn on type conversions that may lose data
            "-Wsign-conversion", # warn on sign conversions
            "-Wnull-dereference", # warn if a null dereference is detected
            "-Wdouble-promotion", # warn if float is implicit promoted to double
            "-Wformat=2", # warn on security issues around functions that format output (ie printf)

            # GCC Warnings
            "-Wmisleading-indentation", # warn if indentation implies blocks where blocks do not exist
            "-Wduplicated-cond", # warn if if / else chain has duplicated conditions
            "-Wduplicated-branches", # warn if if / else branches have duplicated code
            "-Wlogical-op", # warn about logical operations being used where bitwise were probably wanted
            "-Wuseless-cast", # warn if you perform a cast to the same type
           ], # GCC/CLANG
          "msvs_settings": {
            "VCCLCompilerTool": {
              'ExceptionHandling': 2,       # /EHsc
              'BasicRuntimeChecks': 3,        # /RTC1
              # 0 - MultiThreaded (/MT)
              # 1 - MultiThreadedDebug (/MTd)
              # 2 - MultiThreadedDLL (/MD)
              # 3 - MultiThreadedDebugDLL (/MDd)
              'RuntimeLibrary': 3,
              'MinimalRebuild': 'false',
              'Optimization': 0,              # /Od /Oy-, no optimization
              "AdditionalOptions": [
                "/DEBUG",

                # Uncomment to enable address sanitizer
                # Make sure to add the followings (or what your MSVC use) to the PATH and run `refreshenv`.
                # # C:/Program Files (x86)/Microsoft Visual Studio/2019/Preview/VC/Tools/MSVC/14.29.29917/lib/x64/
                # # C:/Program Files (x86)/Microsoft Visual Studio/2019/Preview/VC/Tools/MSVC/14.29.29917/bin/Hostx64/x64/
                # "/fsanitize=address",
                # "/Zi",
                # "/INCREMENTAL:NO",

                # C++ standard
                "/std:c++17",
                # MSVC Warnings
                 # disable warnings on external headers
                "/experimental:external",
                "/external:W0",
                "/external:I <!@(node -p \"require('node-addon-api').include\")",
                "/external:anglebrackets",
                "/Wall", # all warnings,
                "/wd5044", # include path missing
                "/wd4710", # function not inlined
                "/wd4514", # unreferenced inline function has been removed
                "/wd5045", # spectre mitigation insertion warning
                "/wd4820", # 'bytes' bytes padding added after construct 'member_name'
                "/wd4626", # assignment operator was implicitly defined as deleted
                "/wd5027"  # move operator was implicitly defined as deleted
              ],
            },
            "ClCompile": {
              "LanguageStandard": "stdcpp17"
            },
          }, # MSVC
          "xcode_settings": {
            'GCC_OPTIMIZATION_LEVEL': '0', # stop gyp from defaulting to -Os
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
            "CLANG_CXX_LIBRARY": "libc++",
            "CLANG_CXX_LANGUAGE_STANDARD":"c++17",
            'MACOSX_DEPLOYMENT_TARGET': '10.13',
            'OTHER_CFLAGS': [
              '-arch x86_64',
              '-arch arm64'
            ],
            'OTHER_LDFLAGS': [
              '-arch x86_64',
              '-arch arm64'
            ]
          } # XCODE
        }, # Debug
      }, # configurations
  }] # targets
}
