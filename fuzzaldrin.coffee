binding = require('node-gyp-build')(__dirname);

defaultPathSeparator = if process?.platform is "win32" then '\\' else '/'

parseOptions = (options) ->
  options.allowErrors ?= false
  options.usePathScoring ?= true
  options.useExtensionBonus ?= false
  options.pathSeparator ?= defaultPathSeparator
  options.optCharRegEx ?= null
  options.wrap ?= null
  options.maxResults ?= 0
  return options

class FuzzaldrinPlusFast
  constructor: ->
    @obj = new binding.Fuzzaldrin()

  setCandidates: (candidates, options = {}) ->
    @obj.setCandidates(candidates)

  filter: (query, options = {}) ->
    options = parseOptions(options)
    @obj.filter query, options.maxResults,
      options.usePathScoring, options.useExtensionBonus

module.exports =

  New: ->
    new FuzzaldrinPlusFast()

  filter: (candidates, query, options = {}) ->
    if options.key?
      options = parseOptions(options)
      filtered = binding.filterWithCandidates query, options.maxResults,
      options.usePathScoring, options.useExtensionBonus, candidates, options.key
      return filtered.map((item) => candidates[item])
    else
      obj = new FuzzaldrinPlusFast()
      obj.setCandidates(candidates, options)
      obj.filter(query, options)

  score: (candidate, query, options = {}) ->
    options = parseOptions(options)
    binding.score candidate, query, options.usePathScoring, options.useExtensionBonus

  prepareQuery: ->
