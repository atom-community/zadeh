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

class FuzzaldrinPlusFast {
  constructor() {
    this.obj = new binding.Fuzzaldrin()
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
}

module.exports = {
  New: () => new FuzzaldrinPlusFast(),

  filter: (candidates, query, options = {}) => {
    if (!candidates || !query)
      return []
    const obj = new FuzzaldrinPlusFast()
    obj.setCandidates(candidates, options)
    return obj.filter(query, options)
  },

  score: (candidate, query, options = {}) => {
    if (!candidate || !query)
      return 0
    options = parseOptions(options)
    return binding.score(candidate, query,
      Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
  },

  match: (string, query, options = {}) => {
    if (!string || !query)
      return []
    if (string == query)
      return Array.from(Array(string.length).keys())
    options = parseOptions(options, query)
    return binding.match(string, query, options.pathSeparator)
  },

  wrap: (string, query, options = {}) => {
    if (!string || !query)
      return []
    options = parseOptions(options, query)
    return binding.wrap(string, query, options.pathSeparator)
  },

  prepareQuery: (query, options = {}) => {
    // This is no - op since there is no major benefit by precomputing something
    // just for the query.
    return {}
  },
}
