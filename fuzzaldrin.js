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

/** Array Filter */

export class ArrayFilterer {
  constructor() {
    this.obj = new binding.Fuzzaldrin()
  }

  setCandidates(candidates, options = {}) {
    this.candidates = candidates
    if (options.key)
      candidates = candidates.map((item) => item[options.key])
    return this.obj.setArrayFiltererCandidates(candidates)
  }

  filter(query, options = {}) {
    options = parseOptions(options)
    const res = this.obj.filter(query, options.maxResults,
      Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
    return res.map((ind) => this.candidates[ind])
  }
}

/**
 * @deprecated use ArrayFilterer or TreeFilterer instead class instead
 */
export const New = () => new ArrayFilterer()

export function filter (candidates, query, options = {}) {
    if (!candidates || !query)
      return []
    const arrayFilterer = new ArrayFilterer()
    arrayFilterer.setCandidates(candidates, options)
    return arrayFilterer.filter(query, options)
}

/** Tree Filter */

export class TreeFilterer {
  constructor() {
    this.obj = new binding.Fuzzaldrin()
  }

  setCandidates(candidates, dataKey = "data", childrenKey = "children") {
    this.candidates = candidates
    return this.obj.setTreeFiltererCandidates(candidates, dataKey, childrenKey)
  }

  filter(query, options = {}) {
    options = parseOptions(options)
    return this.obj.filterTree(query, options.maxResults,
      Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
  }
}

export function filterTree(candidatesTrees, query, dataKey = "data", childrenKey = "children", options = {}) {
    if (!candidatesTrees || !query)
      return []
    const treeFilterer = new TreeFilterer()
    treeFilterer.setCandidates(candidatesTrees, dataKey, childrenKey)
    return treeFilterer.filter(query, options)
}

export function score (candidate, query, options = {}) {
    if (!candidate || !query)
      return 0
    options = parseOptions(options)
    return binding.score(candidate, query,
      Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
}

/** Other functions */

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
