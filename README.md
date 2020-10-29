[![Build Status](https://travis-ci.org/atom-ide-community/fuzzaldrin-plus-fast.svg?branch=master)](https://travis-ci.org/atom-ide-community/fuzzaldrin-plus-fast) [![Build Status](https://ci.appveyor.com/api/projects/status/github/atom-ide-community/fuzzaldrin-plus-fast?svg=true)](https://ci.appveyor.com/project/atom-ide-community/fuzzaldrin-plus-fast)

Fast fuzzy-search - the native replacement for `fuzzaldrin-plus`

# What is fuzzaldrin-plus-fast?
* Fuzzaldrin plus is an awesome library that provides fuzzy-search that is more targeted towards filenames.
* Fuzzaldrin-plus-fast is a rewrite of the library in native C++ to make it fast. The goal is to make it a few hundred millisecond filter times for a dataset with 1M entries. This performance is helpful in Atom's fuzzy finder to open files from large projects such as Chrome/Mozilla.

This project potentially solves the following Atom fuzzy-finder issues if used.
https://github.com/atom/fuzzy-finder/issues/271
https://github.com/atom/fuzzy-finder/issues/88

# How performance is improved?
Fuzzaldrin-plus-fast achieves 10x-20x performance improvement over Fuzzaldrin plus for chromium project with 300K files. This high performance is achieved using the following techniques.
* Converting Javascript/CoffeeScript code to native C++ bindings provides 4x performance benefit.
* Use multiple threads to parallelize computation to achieve another 4x performance benefit. Currently, up to 8 threads are used if there are more than 10K candidates to filter.
* Some miscellaneous improvements provide additional benefit.

# Is the API the same?
API is backward compatible with Fuzzaldrin and Fuzzaldrin-plus. Additional functions are provided to achieve better performance that could suit your needs.

# Info for Developers
## How to release the package to npm?

* Bump up version in package.json.
* Create a new release tag in Github, for the bumped version. This should trigger builds in Travis CI, Appveyor and the following binaries will be uploaded to GitHub.
* Install prebuildify-ci to download prebuilt binaries from GitHub releases
```
npm install -g prebuildify-ci
```

* Download the prebuilt binaries from GitHub and publish.
```
prebuildify-ci download
npm publish
```
