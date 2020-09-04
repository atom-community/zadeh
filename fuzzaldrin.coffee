binding = require('node-gyp-build')(__dirname);

defaultPathSeparator = if process?.platform is "win32" then '\\' else '/'

parseOptions = (options, query) ->
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
    @candidates = candidates
    if options.key?
      candidates = candidates.map((item) => item[options.key])
    @obj.setCandidates(candidates)

  filter: (query, options = {}) ->
    options = parseOptions(options)
    res = @obj.filter query, options.maxResults,
      options.usePathScoring, options.useExtensionBonus
    return res.map((ind) => @candidates[ind])

module.exports =

  New: ->
    new FuzzaldrinPlusFast()

  filter: (candidates, query, options = {}) ->
    return [] unless query?.length and candidates?.length
    obj = new FuzzaldrinPlusFast()
    obj.setCandidates(candidates, options)
    return obj.filter(query, options)

  score: (candidate, query, options = {}) ->
    return 0 unless candidate?.length and query?.length
    options = parseOptions(options)
    binding.score candidate, query, options.usePathScoring, options.useExtensionBonus

  match: (string, query, options = {}) ->
    return [] unless string
    return [] unless query
    return [0...string.length] if string is query
    options = parseOptions(options, query)
    return binding.match(string, query, options.pathSeparator)

  wrap: (string, query, options = {}) ->
    return [] unless string
    return [] unless query
    options = parseOptions(options, query)
    return binding.wrap(string, query, options.pathSeparator)
