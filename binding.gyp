{
  "targets": [
    {
      "target_name": "fuzzaldrinplusfast",
      "sources": [ "src/fuzzaldrin.cc", "src/scorer.cc", "src/path_scorer.cc", "src/filter.cc", "src/query.cc", "src/matcher.cc", "src/tree.cc" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      "cflags": [ "-fno-exceptions" ],
      "cflags_cc": [ "-fno-exceptions", "-std=c++17" ],
      "conditions": [
        ['OS=="mac"', {
            "xcode_settings": {
              'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
              "CLANG_CXX_LIBRARY": "libc++",
              "CLANG_CXX_LANGUAGE_STANDARD":"c++17",
              'MACOSX_DEPLOYMENT_TARGET': '10.14'
            }
        }],
        ['OS=="win"', {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "AdditionalOptions": [ "-std:c++latest", ],
            },
          },
        }]
      ]
    }
  ]
}
