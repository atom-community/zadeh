const binding = require('node-gyp-build')(__dirname)

const defaultPathSeparator = process.platform === "win32" ? '\\' : '/'

function parseOptions(options, query) {
  // options.allowErrors ? = false
  if (options.usePathScoring == undefined)
    options.usePathScoring = true
  // options.useExtensionBonus ? = false
  if (!options.pathSeparator)
    options.pathSeparator = defaultPathSeparator
  // options.optCharRegEx ? = null
  // options.wrap ? = null
  if (!options.maxResults)
    options.maxResults = 0
  return options
}

export class ArrayFilterer {
  constructor() {
    this.obj = new binding.ArrayFilterer()
  }

  setCandidates(candidates, options = {}) {
    this.candidates = candidates
    if (options.key)
      candidates = candidates.map((item) => item[options.key])
    return this.obj.setCandidates(candidates)
  }

  filter(query, options = {}) {
    options = parseOptions(options)
    const res = this.obj.filter(query, options.maxResults,
      Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
    return res.map((ind) => this.candidates[ind])
  }

  filterTree(candidatesTrees, query, dataKey = "data", childrenKey = "children", options = {}) {
    options = parseOptions(options)
    return this.obj.filterTree(candidatesTrees, query, dataKey, childrenKey, options.maxResults,
      Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
  }
}

export const New = () => new FuzzaldrinPlusFast()

export function filter (candidates, query, options = {}) {
    if (!candidates || !query)
      return []
    const obj = new ArrayFilterer()
    obj.setCandidates(candidates, options)
    return obj.filter(query, options)
}


export function filterTree(candidatesTrees, query, dataKey = "data", childrenKey = "children", options = {}) {
    if (!candidatesTrees || !query)
      return []
    const obj = new ArrayFilterer()
    return obj.filterTree(candidatesTrees, query, dataKey, childrenKey, options)
}

export function score (candidate, query, options = {}) {
    if (!candidate || !query)
      return 0
    options = parseOptions(options)
    return binding.score(candidate, query,
      Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
}

export function match (string, query, options = {}) {
    if (!string || !query)
      return []
    if (string == query)
      return Array.from(Array(string.length).keys())
    options = parseOptions(options, query)
    return binding.match(string, query, options.pathSeparator)
}

export function wrap (string, query, options = {}) {
    if (!string || !query)
      return []
    options = parseOptions(options, query)
    return binding.wrap(string, query, options.pathSeparator)
}

export function prepareQuery (query, options = {}) {
    // This is no - op since there is no major benefit by precomputing something
    // just for the query.
    return {}
}
