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
    @item_to_val = null
    if options.key?
      @item_to_val = {}
      newcandidates = []
      for c in candidates
        newcandidates.push c[options.key]
        @item_to_val[c[options.key]] = c
      candidates = newcandidates
    @obj.setCandidates(candidates)

  filter: (query, options = {}) ->
    options = parseOptions(options)
    filtered = @obj.filter query, options.maxResults,
      options.usePathScoring, options.useExtensionBonus
    return if @item_to_val? then filtered.map((item) => @item_to_val[item]) else filtered

module.exports =

  New: ->
    new FuzzaldrinPlusFast()

  filter: (candidates, query, options = {}) ->
    obj = new FuzzaldrinPlusFast()
    obj.setCandidates(candidates, options)
    obj.filter(query, options)

  score: (candidate, query, options = {}) ->
    options = parseOptions(options)
    binding.score candidate, query, options.usePathScoring, options.useExtensionBonus

  prepareQuery: ->
