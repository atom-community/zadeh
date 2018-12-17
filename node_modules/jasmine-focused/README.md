# Jasmine Focused Node Module [![Build Status](https://travis-ci.org/atom/jasmine-focused.png)](https://travis-ci.org/atom/jasmine-focused)

Adds global functions to run only certain
[Jasmine](https://github.com/pivotal/jasmine) specs.

The number of `f` characters in the method name denotes the
priority of the `describe` or `it` spec.

For example, a `fit` spec would be run instead of any `it` specs and a
`ffit` spec would be run instead of any `fit` or `it` specs.

This module includes a `jasmine-focused` executable that wraps
[jasmine-node](https://github.com/mhevery/jasmine-node) allowing you to use the
focus functions without adding any additional requires to your spec files.

It passes through all command line flags to `jasmine-node`.

## Installing

```sh
npm install jasmine-focused
```

## Building
  * Clone the repository
  * Run `npm install`
  * Run `grunt` to compile the CoffeeScript

## Using

The following function are provides that wrap the standard `it` and `describe`
Jasmine functions.

  * `fit`
  * `ffit`
  * `fffit`
  * `fdescribe`
  * `ffdescribe`
  * `fffdescribe`

You can remove all focused specs by running the bundled `nof` script. This
script takes a list of directories and defaults to un-focusing all specs
in the `spec` directory.
