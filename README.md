![CI](https://github.com/atom-ide-community/fuzzaldrin-plus-fast/workflows/CI/badge.svg)

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

### New()
Initializes the native binding
```js
const { New } = require('fuzzaldrin-plus-fast')
New()
```

# Info for Developers
## How to release the package to npm?

* Bump up version in package.json.
* Create a new release tag in Github, for the bumped version. This should trigger builds in GitHub Actions. The binaries will be uploaded to the action's page.
* Manually download the prebuilt binaries from GitHub and publish.
```
npm publish
```
