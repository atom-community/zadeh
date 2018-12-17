{
  "targets": [
    {
      "target_name": "fuzzaldrinplusfast",
      "sources": [ "src/fuzzaldrin.cc", "src/scorer.cc", "src/path_scorer.cc", "src/filter.cc", "src/query.cc" ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}
