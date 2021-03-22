Blazing fast library for fuzzy filtering, matching, and other fuzzy things!

![CI](https://github.com/atom-ide-community/zadeh/workflows/CI/badge.svg)

# Zadeh

Zadeh is a blazing fast library for fuzzy filtering, matching, and other fuzzy things. Zadeh is a multi-threaded library written in C++ with the goal to search through a dataset with 1M entries in a few hundred milliseconds.

### features

- fuzzy filter through an array of candidates (`ArrayFilterer` and `filter`)
- fuzzy filter through a nested tree-like objects (`TreeFilterer` and `filterTree`)
- Special treatment for strings that have separators (space ` `, hyphen `-`, underline`_`)
- Special treatment for path-like strings (string separated by `\` or `//`)
- give an array of indices at which the query matches the given string (`match`)
- score the given string against the given query (`score`)
- give an HTML/Markdown string that highlights the range for which the match happens (`wrap`)
- Allows setting the candidates only once using `ArrayFilterer` and `TreeFilterer` classes, and then, perform `filter` multiple times, which is much more efficient than calling the `filter` or `filterTree` functions directly every time.
- Bindings for Nodejs (more to come)

### Table of content

- [Zadeh](#zadeh)
  - [features](#features)
- [Usage](#usage)
  - [Usage from Nodejs](#usage-from-nodejs)
    - [ArrayFilterer](#arrayfilterer)
    - [filter](#filter)
    - [TreeFilterer](#treefilterer)
    - [filterTree](#filtertree)
    - [score](#score)
    - [match](#match)
    - [wrap](#wrap)
    - [options](#options)
- [Comparison with other libraries](#comparison-with-other-libraries)
  - [Zadeh vs fuzzaldrin and fuzzaldrin-plus](#zadeh-vs-fuzzaldrin-and-fuzzaldrin-plus)

# Usage

### Usage from C++

This is a header only library. Include `./src/zadeh.h` and build it in your application.

`examples/example1.cpp`:

```cpp
#include "../src/zadeh.h"  // include zadeh.h
#include <string>
#include <iostream>

using namespace std;

int main() {
  // the data to fuzzy search on
  auto data = vector<string>{"eye", "why", "bi"};

  // setup ArrayFilterer
  auto arrayFilterer = zadeh::ArrayFilterer<vector<string>, string>{};
  arrayFilterer.set_candidates(data);

  // filter the indices that match the query
  auto filtered_indices = arrayFilterer.filter_indices("ye");

  // print the filtered data
  for (auto ind: filtered_indices) {
    cout << data[ind] << '\n';
  }
}
```

Cmake file:

```cmake
cmake_minimum_required(VERSION 3.17)

project(example1 LANGUAGES CXX)
add_executable(example1 ./examples/example1.cpp)
target_compile_features(example1 PRIVATE cxx_std_17)
```

Build:

```
cmake -S . -B ./build && cmake --build ./build --config Debug
```

## Usage from Nodejs

Installation:

```sh
npm install zadeh
```

To import all the functions:

```js
import * as zadeh from "zadeh"
```

or

```js
const zadeh = require("zadeh")
```

### ArrayFilterer

ArrayFilterer is a class that allows to set the `candidates` only once and perform filtering on them multiple times. This is much more efficient than calling the `filter` function directly.

```typescript
export class ArrayFilterer<T> {
  constructor()

  /** The method to set the candidates that are going to be filtered
   * @param candidates An array of tree objects.
   * @param dataKey (optional) if `candidates` is an array of objects, pass the key in the object which holds the data. dataKey can be the options object passed to `filter` method (but this is deprecated).
   */
  setCandidates<T>(candidates: Array<T>, dataKey?: string): void

  /** The method to perform the filtering on the already set candidates
   *  @param query A string query to match each candidate against.
   *  @param options options
   *  @return returns an array of candidates sorted by best match against the query.
   */
  filter(query: string, options: IFilterOptions<T>): Array<T>
}
```

Example:

```Javascript
const { ArrayFilterer } = require('zadeh')

const arrayFilterer = new ArrayFilterer()
arrayFilterer.setCandidates(['Call', 'Me', 'Maybe']) // set candidates only once
// call filter multiple times
arrayFilterer.filter('me')
arrayFilterer.filter('all')
```

### filter

    filter(candidates, query, options = {})

Sort and filter the given candidates by matching them against the given query.

- `candidates` - An array of strings or objects.
- `query` - A string query to match each candidate against.
- `options` options. You should provide a `key` in the options if an array of objects are passed.

Returns an array of candidates sorted by best match against the query.

```js
const { filter } = require('zadeh')

// With an array of strings
let candidates = ['Call', 'Me', 'Maybe']
let results = filter(candidates, 'me')  // ['Me', 'Maybe']

// With an array of objects
candidates = [
  {name: 'Call', id: 1}
  {name: 'Me', id: 2}
  {name: 'Maybe', id: 3}
]
results = filter(candidates, 'me', {key: 'name'}) // [{name: 'Me', id: 2}, {name: 'Maybe', id: 3}]
```

**Performance Note**: use `ArrayFilterer` class if you call the `filter` function multiple times on a certain set of candidates. `filter` internally uses this class, however, in each call it sets the candidates from scratch which can slow down the process.

### TreeFilterer

`TreeFilterer` is a class that allows to set the `candidates` only once and perform filtering on them multiple times. This is much more efficient than calling the `filterTree` function directly.

```typescript
export class TreeFilterer<T> {
  constructor()

  /** The method to set the candidates that are going to be filtered
   * @param candidates An array of tree objects.
   * @param dataKey the key of the object (and its children) which holds the data (defaults to `"data"`)
   * @param childrenKey the key of the object (and its children) which hold the children (defaults to `"children"`)
   */
  setCandidates<T>(candidates: Array<T>, dataKey?: string, childrenKey?: string): void

  /** The method to perform the filtering on the already set candidates
   *  @param query A string query to match each candidate against.
   *  @param options options
   *  @return An array of candidate objects in form of `{data, index, level}` sorted by best match against the query. Each objects has the address of the object in the tree using `index` and `level`.
   */
  filter(query: string, options: IFilterOptions<object>): TreeFilterResult[]
}
```

Example:

```Javascript
const { TreeFilterer } = require('zadeh')

const arrayFilterer = new TreeFilterer()

const candidates = [
  {data: "bye1", children: [{data: "hello"}]},
  {data: "Bye2", children: [{data: "_bye4"}, {data: "hel"}]},
  {data: "eye"},
]
arrayFilterer.setCandidates(candidates, "data", "children") // set candidates only once

// call filter multiple times
arrayFilterer.filter('hello')
arrayFilterer.filter('bye')
```

### filterTree

    filterTree(candidates, query, dataKey, childrenKey, options = {})

Sort and filter the given Tree candidates by matching them against the given query.

A **tree object** is an object in which each entry stores the data in its dataKey and it has (may have) some children (with a similar structure) in its childrenKey. See the following example.

- `candidates` An array of tree objects.
- `query` A string query to match each candidate against.
- `dataKey` the key of the object (and its children) which holds the data
- `childrenKey` the key of the object (and its children) which hold the children
- `options` options
- `returns` An array of candidate objects in form of `{data, index, level}` sorted by best match against the query. Each objects has the address of the object in the tree using `index` and `level`.

```js
const { filterTree } = require("zadeh")

candidates = [
  { data: "bye1", children: [{ data: "hello" }] },
  { data: "Bye2", children: [{ data: "_bye4" }, { data: "hel" }] },
  { data: "eye" },
]

filterTree(candidates, "he", "data", "children") // [ { data: 'hel', index: 1, level: 1 },  { data: 'hello', index: 0, level: 1 }]

// With an array of objects (similar to providing `key` to `filter` function)
const candidates = [{ data: "helloworld" }, { data: "bye" }, { data: "hello" }]
results = filter(candidates, "hello", { key: "name" }) // [ { data: 'hello', index: 2, level: 0 }, { data: 'helloworld', index: 0, level: 0 } ]
```

**Performance Note**: use `TreeFilterer` class if you call the `filterTree` function multiple times on a certain set of candidates. `filterTree` internally uses this class, however, in each call it sets the candidates from scratch which can slow down the process.

### score

    score(string, query, options = {})

Score the given string against the given query.

- `string` - The string the score.
- `query` - The query to score the string against.

```js
const { score } = require('zadeh')

score('Me', 'me')    # 0.17099999999999999
score('Maybe', 'me') # 0.0693
```

### match

    match(string, query, options = {})

Gives an array of indices at which the query matches the given string

```js
const { match } = require("zadeh")

match("Hello World", "he") // [0, 1]
match("Hello World", "wor") // [6, 7, 8]
match("Hello World", "elwor") // [1, 2, 6, 7, 8]
```

### wrap

    wrap (string, query, options = {})

Gives an HTML/Markdown string that highlights the range for which the match happens

```js
wrap("helloworld", "he")
```

<strong class="highlight">he</strong>lloworld

```js
wrap("Hello world", "he")
```

<strong class="highlight">He</strong>llo world

### options

In all the above functions, you can pass an optional object with the following keys

```typescript
{
    /** only for `filter` function */
    /** The key to use when candidates is an object */
    key?: T extends string ? never : keyof T

    /** only for `filter` function */
    maxResults?: number

    /** @default false */
    allowErrors?: boolean

    /** @default true */
    usePathScoring?: boolean

    /** @default false */
    useExtensionBonus?: boolean

    pathSeparator?: '/' | '\\' | string
}
```

# Comparison with other libraries

### Zadeh vs fuzzaldrin and fuzzaldrin-plus

API is backward compatible with Fuzzaldrin and Fuzzaldrin-plus. Additional functions are provided to achieve better performance that could suit your needs

Zadeh achieves 10x-20x performance improvement over Fuzzaldrin plus for chromium project with 300K files. This high performance is achieved using the following techniques.

- Uses native C++ bindings that provides `~4x` performance benefit.
- Use multiple threads to parallelize computation to achieve another `~4x` performance benefit.
- Some miscellaneous improvements provide additional benefit.

This project potentially solves the following Atom fuzzy-finder issues if used.
https://github.com/atom/fuzzy-finder/issues/271 and https://github.com/atom/fuzzy-finder/issues/88
