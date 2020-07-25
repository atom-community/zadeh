binding = require('node-gyp-build')(__dirname);

# for missing API
matcher = require('fuzzaldrin-plus/lib/matcher')
Query = require('fuzzaldrin-plus/lib/query')

defaultPathSeparator = if process?.platform is "win32" then '\\' else '/'

preparedQueryCache = null
parseOptions = (options, query) ->
  options.allowErrors ?= false
  options.usePathScoring ?= true
  options.useExtensionBonus ?= false
  options.pathSeparator ?= defaultPathSeparator
  options.optCharRegEx ?= null
  options.wrap ?= null
  options.maxResults ?= 0
  options.preparedQuery ?=
    if preparedQueryCache and preparedQueryCache.query is query
    then preparedQueryCache
    else (preparedQueryCache = new Query(query, options))
  return options

class FuzzaldrinPlusFast
  constructor: ->
    @obj = new binding.Fuzzaldrin()

  setCandidates: (candidates, options = {}) ->
    if options.key?
      @candidates = candidates
      @candidate_key = options.key
      candidates = candidates.map((item) => item[@candidate_key])
    else
      @candidates = null
      @candidate_key = null
    @obj.setCandidates(candidates)

  filter: (query, options = {}) ->
    options = parseOptions(options)
    returnIndexes = @candidate_key?
    res = @obj.filter query, options.maxResults,
      options.usePathScoring, options.useExtensionBonus, returnIndexes
    if returnIndexes
      res = res.map((ind) => @candidates[ind])
    return res

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

  match: (string, query, options = {}) ->
    return [] unless string
    return [] unless query
    return [0...string.length] if string is query
    options = parseOptions(options, query)
    return matcher.match(string, query, options)

  wrap: (string, query, options = {}) ->
    return [] unless string
    return [] unless query
    options = parseOptions(options, query)
    return matcher.wrap(string, query, options)

  prepareQuery: (query, options = {}) ->
    options = parseOptions(options, query)
    return options.preparedQuery
