![CI](https://github.com/atom-ide-community/fuzzaldrin-plus-fast/workflows/CI/badge.svg)

Fast fuzzy-search - the native replacement for `fuzzaldrin-plus`

# What is fuzzaldrin-plus-fast?
* Fuzzaldrin plus is an awesome library that provides fuzzy-search that is more targeted towards filenames.
* Fuzzaldrin-plus-fast is a rewrite of the library in native C++ to make it fast. The goal is to make it a few hundred millisecond filter times for a dataset with 1M entries. This performance is helpful in Atom's fuzzy finder to open files from large projects such as Chrome/Mozilla.

### Extra featuers
Fuzzaldrin-plus-fast:
- provides `filterTree` function which allows to fuzzy filter text in nested tree-like objects.
- allows setting the candidates only once using `ArrayFilterer` and `TreeFilterer` classes only once, and then, perform `filter` multiple times. This is much more efficient than calling the `filter` functions directly every time.

# How performance is improved?
Fuzzaldrin-plus-fast achieves 10x-20x performance improvement over Fuzzaldrin plus for chromium project with 300K files. This high performance is achieved using the following techniques.
* Converting Javascript/CoffeeScript code to native C++ bindings provides 4x performance benefit.
* Use multiple threads to parallelize computation to achieve another 4x performance benefit. Currently, up to 8 threads are used if there are more than 10K candidates to filter.
* Some miscellaneous improvements provide additional benefit.

This project potentially solves the following Atom fuzzy-finder issues if used.
https://github.com/atom/fuzzy-finder/issues/271 and https://github.com/atom/fuzzy-finder/issues/88

# Is the API the same?
API is backward compatible with Fuzzaldrin and Fuzzaldrin-plus. Additional functions are provided to achieve better performance that could suit your needs

# Usage

Installation:

```sh
npm install fuzzaldrin-plus-fast
```

To import all the functions:
```js
import * as fuzzaldrin from 'fuzzaldrin-plus-fast'
```
or
```js
const fuzzaldrin = require('fuzzaldrin-plus-fast')
```

### filter(candidates, query, options = {})

Sort and filter the given candidates by matching them against the given query.

* `candidates` - An array of strings or objects.
* `query` - A string query to match each candidate against.
* `options` options. You should provide a `key` in the options if an array of objects are passed.

Returns an array of candidates sorted by best match against the query.

```js
const { filter } = require('fuzzaldrin-plus-fast')

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
const { ArrayFilterer } = require('fuzzaldrin-plus-fast')

const arrayFilterer = new ArrayFilterer()
arrayFilterer.setCandidates(['Call', 'Me', 'Maybe']) // set candidates only once
// call filter multiple times
arrayFilterer.filter('me')
arrayFilterer.filter('all')
```

### filterTree(candidates, query, dataKey, childrenKey, options = {})

Sort and filter the given Tree candidates by matching them against the given query.

A **tree object** is an object in which each entry stores the data in its dataKey and it has (may have) some children (with a similar structure) in its childrenKey. See the following example.

* `candidates` An array of tree objects.
* `query` A string query to match each candidate against.
* `dataKey` the key of the object (and its children) which holds the data
* `childrenKey` the key of the object (and its children) which hold the children
* `options` options
* `returns` An array of candidate objects in form of `{data, index, level}` sorted by best match against the query. Each objects has the address of the object in the tree using `index` and `level`.

```js
const { filterTree } = require('fuzzaldrin-plus-fast')

candidates = [
  {data: "bye1", children: [{data: "hello"}]},
  {data: "Bye2", children: [{data: "_bye4"}, {data: "hel"}]},
  {data: "eye"},
]

filterTree(candidates, "he", "data", "children") // [ { data: 'hel', index: 1, level: 1 },  { data: 'hello', index: 0, level: 1 }]

// With an array of objects (similar to providing `key` to `filter` function)
const candidates = [
  {data: "helloworld"},
  {data: "bye"},
  {data: "hello"},
]
results = filter(candidates, 'hello', {key: 'name'}) // [ { data: 'hello', index: 2, level: 0 }, { data: 'helloworld', index: 0, level: 0 } ]
```

### score(string, query, options = {})

Score the given string against the given query.

* `string` - The string the score.
* `query` - The query to score the string against.

```js
const { score } = require('fuzzaldrin-plus-fast')

score('Me', 'me')    # 0.17099999999999999
score('Maybe', 'me') # 0.0693
```

### match (string, query, options = {})
Gives an array of indices at which the query matches the given string
```js
const { match } = require('fuzzaldrin-plus-fast')

match('Hello World', 'he')    // [0, 1]
match('Hello World', 'wor')   // [6, 7, 8]
match('Hello World', 'elwor') // [1, 2, 6, 7, 8]
```

### wrap (string, query, options = {})
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

# Info for Developers
## How to release the package to npm?

* Bump up version in package.json.
* Create a new release tag in Github, for the bumped version. This should trigger builds in GitHub Actions. The binaries will be uploaded to the action's page.
* Manually download the prebuilt binaries from GitHub and publish.
```
npm publish
```
