[![Build Status](https://travis-ci.org/rajendrant/fuzzaldrin-plus-fast.svg?branch=master)](https://travis-ci.org/rajendrant/fuzzaldrin-plus-fast) [![Build Status](https://ci.appveyor.com/api/projects/status/github/rajendrant/fuzzaldrin-plus-fast?svg=true)](https://ci.appveyor.com/project/rajendrant/fuzzaldrin-plus-fast)


# What is fuzzaldrin-plus-fast ?
* Fuzzaldrin plus is an awesome library that provides fuzzy search that is more targeted towards filenames.
* Fuzzaldrin-plus-fast is a rewrite of the library in native c++ to make it fast. The goal is to make it a few hundred millisecond filter times for dataset with 1M entries. This performance is helpful in atom fuzzy finder to open files from large projects such as chrome/mozilla.

This project potentially solves the following Atom fuzzy-finder issues if used.
https://github.com/atom/fuzzy-finder/issues/271
https://github.com/atom/fuzzy-finder/issues/88

# How performance is improved ?
Fuzzaldrin-plus-fast achieves 10x-20x performance improvement over Fuzzaldrin plus for chromium project with 300K files. This performance is achieved using the following techniques.
* Converting javascript/coffeescript code to native c++ bindings provides 4x performance benefit.
* Use multiple threads to parellize computation to achieve another 4x performance benefit. Currently upto 8 threads are used if there are more than 10K candidates to filter.
* Some miscellaneous improvements provide additioal benefit.

# Is the API the same ?
API is backward compatible with Fuzzaldrin and Fuzzaldrin-plus. Additional functions are provided to achieve better performance that could suit your needs.
