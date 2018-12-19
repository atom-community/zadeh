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
    if options.key?
      candidates = candidates.map(item => item[options.key])
    @obj.setCandidates(candidates)

  filter: (query, options = {}) ->
    options = parseOptions(options)
    @obj.filter query, options.maxResults,
      options.usePathScoring, options.useExtensionBonus

module.exports =

  New: ->
    new FuzzaldrinPlusFast()

  filter: (candidates, query, options = {}) ->
    obj = new FuzzaldrinPlusFast()
    obj.setCandidates(candidates, options)
    obj.filter(query, options)

  score: (candidate, query, options = {}) ->
    binding.score candidate, query, options

  prepareQuery: ->
