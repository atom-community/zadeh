fuzzaldrinplusfast = require('node-gyp-build')(__dirname);

module.exports =

  New: ->
    new fuzzaldrinplusfast.Fuzzaldrin()

  filter: (candidates, query, options = {}) ->
    obj = new fuzzaldrinplusfast.Fuzzaldrin()
    obj.setCandidates(candidates)
    obj.filter(query, options)

  score: (candidate, query, options = {}) ->
    fuzzaldrinplusfast.score candidate, query, options

  prepareQuery: ->
