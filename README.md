Blazing fast library for fuzzy filtering, matching, and other fuzzy things!

![CI](https://github.com/atom-ide-community/zadeh/workflows/CI/badge.svg)

# Zadeh

Zadeh is a blazing fast library for fuzzy filtering, matching, and other fuzzy things. Zadeh is a multi-threaded library written in C++ with the goal to search through a dataset with 1M entries in a few hundred milliseconds.

### features

- fuzzy filter through an array of candidates (`StringArrayFilterer`)
- fuzzy filter through a nested tree-like objects (`TreeFilterer`)
- Special treatment for strings that have separators (space ` `, hyphen `-`, underline`_`)
- Special treatment for path-like strings (string separated by `\` or `//`)
- give an array of indices at which the query matches the given string (`match`)
- score the given string against the given query (`score`)
- give an HTML/Markdown string that highlights the range for which the match happens (`wrap`)
- Allows setting the candidates only once using `StringArrayFilterer` and `TreeFilterer` classes, and then, perform `filter` multiple times, which is much more efficient than calling the `filter` or `filterTree` functions directly every time.
- Bindings for Nodejs (more to come)

# Usage

## Usage from C++

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

  // setup StringArrayFilterer
  auto strArrFilterer = zadeh::StringArrayFilterer<vector<string>, string>{};
  strArrFilterer.set_candidates(data);

  // filter the indices that match the query
  auto filtered_indices = strArrFilterer.filter_indices("ye");

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

### StringArrayFilterer

`StringArrayFilterer` is a class that allows to set the `candidates` only once and perform filtering on them multiple times. This is much more efficient than calling the `filter` function directly.

<details>
<summary>`StringArrayFilterer` API</summary>

```ts
export class StringArrayFilterer {
  /**
   * Make a `StringArrayFilterer` for the candidates that are going to be filtered.
   *
   * @param candidates An array of strings.
   */
  constructor(candidates?: Array<string>)

  /**
   * Filter the already set array of strings
   *
   * @param query A string query to match each candidate against.
   * @param options Options
   * @returns Returns an array of candidates sorted by best match against the query.
   */
  filter(query: string, options: StringArrayFilterOptions = {}): Array<string>

  /**
   * Filter the already set array of objects and get the indices of the chosen candidate
   *
   * @param query A string query to match the dataKey of each candidate against.
   * @param options Options
   * @returns Returns an array of numbers indicating the index of the chosen candidate sorted by best match against the query.
   */
  filterIndices(query: string, options: StringArrayFilterOptions = {}): Array<number>

  /**
   * Allows to set the candidates (if changed or not set in the constructor).
   *
   * @param candidates An array of strings.
   */
  setCandidates(candidates: Array<string>)
}
```

</details>
<br/>

**Example**:

```js
const { StringArrayFilterer } = require("zadeh")

// create class
const strArrFilterer = new StringArrayFilterer()

// set the candidates
strArrFilterer.setCandidates(["Call", "Me", "Maybe"])

// call filter multiple times
strArrFilterer.filter("me")
strArrFilterer.filter("all")
```

### ObjectArrayFilterer

ObjectArrayFilterer is a class that performs filtering on an array of objects based on a string stored in the given `dataKey` for each object

<details>
<summary>`ObjectArrayFilterer` API</summary>

```ts
export class ObjectArrayFilterer<DataKey extends string | number = string> {
  /**
   * Make a `ObjectArrayFilterer` for the candidates that are going to be filtered.
   *
   * @param candidates An array of objects.
   * @param dataKey The key which is indexed for each object, and filtering is done based on the resulting string
   */
  constructor(candidates?: Array<ObjectWithKey<DataKey>>, dataKey?: DataKey)

  /**
   * Filter the already set objects
   *
   * @param query A string query to match the dataKey of each candidate against.
   * @param options Options
   * @returns Returns an array of objects sorted by best match against the query.
   */
  filter(query: string, options: ObjectArrayFilterOptions = {}): Array<ObjectWithKey>

  /**
   * Filter the already set array of strings and get the indices of the chosen candidate
   *
   * @param query A string query to match each candidate against.
   * @param options Options
   * @returns Returns an array of numbers indicating the index of the chosen candidate sorted by best match against the query.
   */
  filterIndices(query: string, options: StringArrayFilterOptions = {}): Array<number>

  /**
   * Allows to set the candidates (if changed or not set in the constructor).
   *
   * @param candidates An array of objects.
   * @param dataKey The key which is indexed for each object, and filtering is done based on the resulting string
   */
  setCandidates(candidates: Array<ObjectWithKey<DataKey>>, dataKey: DataKey)
}
```

</details>
<br/>

**Example**:

```js
const { ObjectArrayFilterer } = require("zadeh")

const candidates = [
  { name: "Call", id: 1 },
  { name: "Me", id: 2 },
  { name: "Maybe", id: 3 },
]

// create a class and set the candidates
const objArrFilterer = new ObjectArrayFilterer(candidates, "name") // filter based on their name

// call filter multiple times
objArrFilterer.filter("me") // [{ name: 'Me', id: 2 }, { name: 'Maybe', id: 3}] // finds two objects
objArrFilterer.filter("all") // [{ name: 'Call', id: 1 }]
```

### TreeFilterer

TreeFilterer is a filters the given query in the nodes of the given array of trees, and returns an array of filtered
trees (or the indices of the filter candidates). A tree object is an object in which each entry stores the data in its `dataKey` and it has (may have) some
children (with a similar structure) in its `childrenKey`

<details>
<summary>`TreeFilterer` API</summary>

```ts
export class TreeFilterer<DataKey extends string, ChildrenKey extends string> {
  /**
   * The method to set an array of trees that are going to be filtered
   *
   * @param candidates An array of tree objects.
   * @param dataKey The key of the object (and its children) which holds the data (defaults to `"data"`)
   * @param childrenKey The key of the object (and its children) which hold the children (defaults to `"children"`)
   */
  constructor(
    candidates?: Tree<DataKey, ChildrenKey>[],
    dataKey: DataKey = "data",
    childrenKey: ChildrenKey = "children"
  )

  /**
   * The method to set an array of trees that are going to be filtered
   *
   * @param candidates An array of tree objects.
   * @param dataKey The key of the object (and its children) which holds the data (defaults to `"data"`)
   * @param childrenKey The key of the object (and its children) which hold the children (defaults to `"children"`)
   */
  setCandidates(
    candidates: Tree<DataKey, ChildrenKey>[],
    dataKey: DataKey = "data",
    childrenKey: ChildrenKey = "children"
  )

  /**
   * Filter the already set trees
   *
   * @param query A string query to match the dataKey of each candidate against.
   * @param options Options
   * @returns {Tree[]} An array of filtered trees. In a tree, the filtered data is at the last level (if it has
   *   children, they are not included in the filered tree)
   */
  filter(query: string, options: TreeFilterOptions = {}): Tree<DataKey, ChildrenKey>[]

  /**
   * The method to perform the filtering on the already set candidates
   *
   * @param query A string query to match the dataKey of each candidate against.
   * @param options Options
   * @returns {TreeFilterIndicesResult[]} An array candidate objects in form of `{data, index, parentIndices}` sorted by
   *   best match against the query. Each objects has the address of the object in the tree using `index` and `parent_indices`
   */
  filterIndices(query: string, options: TreeFilterOptions = {}): TreeFilterIndicesResult[]
}
```

</details>
<br/>

**Example**:

```js
const { TreeFilterer } = require("zadeh")

const treeFilterer = new TreeFilterer()

const candidates = [
  { data: "bye1", children: [{ data: "hello" }] },
  { data: "Bye2", children: [{ data: "_bye4" }, { data: "hel" }] },
  { data: "eye" },
]
treeFilterer.setCandidates(candidates, "data", "children")
```

```ts
treeFilterer.filter("hel")
```

returns

```ts
;[
  { data: "Bye2", children: [{ data: "hel" }] },
  { data: "bye1", children: [{ data: "hello" }] },
]
```

```ts
treeFilterer.filter("bye")
```

returns

```ts
;[
  { data: "bye1", children: [] },
  { data: "Bye2", children: [{ data: "_bye4" }] },
  { data: "Bye2", children: [] },
]
```

```ts
treeFilterer.filterIndices("bye")
```

returns

```ts
;[
  { data: "bye1", index: 0, parent_indices: [] },
  { data: "_bye4", index: 0, parent_indices: [1] },
  { data: "Bye2", index: 1, parent_indices: [] },
]
```

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

```ts
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

## Deprecated functions

These deprecated functions are provided to support the API of `fuzzaldrin` and `fuzzaldrin-plus`.
However, you should replace their usage with `StringArrayFilterer` or `ObjectArrayFilterer` classes that allow setting the candidates only once and perform filtering on those candidates multiple times. This is much more efficient than `filter` or `filterTree` functions.

<details>
<summary> `filter` function </summary>

### filter

    filter(candidates, query, options = {})

Sort and filter the given candidates by matching them against the given query.

- `candidates` - An array of strings or objects.
- `query` - A string query to match each candidate against.
- `options` options. You should provide a `key` in the options if an array of objects are passed.

Returns an array of candidates sorted by best match against the query.

```js
const { filter } = require("zadeh")

// With an array of strings
let candidates = ["Call", "Me", "Maybe"]
let results = filter(candidates, "me") // ['Me', 'Maybe']

// With an array of objects
const candidates = [
  { name: "Call", id: 1 },
  { name: "Me", id: 2 },
  { name: "Maybe", id: 3 },
]

results = filter(candidates, "me", { key: "name" }) // [{name: 'Me', id: 2}, {name: 'Maybe', id: 3}]
```

**Deprecation Note**: use `StringArrayFilterer` or `ObjectArrayFilterer` class instead. `filter` internally uses this class and in each call, it sets the candidates from scratch which can slow down the process.

</details>

# Comparison with other libraries

### Zadeh vs fuzzaldrin and fuzzaldrin-plus

API is backward compatible with Fuzzaldrin and Fuzzaldrin-plus. Additional functions are provided to achieve better performance that could suit your needs

Zadeh achieves 10x-20x performance improvement over Fuzzaldrin plus for chromium project with 300K files. This high performance is achieved using the following techniques.

- Uses native C++ bindings that provides `~4x` performance benefit.
- Use multiple threads to parallelize computation to achieve another `~4x` performance benefit.
- Some miscellaneous improvements provide additional benefit.

This project potentially solves the following Atom fuzzy-finder issues if used.
https://github.com/atom/fuzzy-finder/issues/271 and https://github.com/atom/fuzzy-finder/issues/88
