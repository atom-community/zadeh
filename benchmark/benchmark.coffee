fs = require 'fs'
path = require 'path'

performance = null
try
  performance = (require 'perf_hooks').performance
catch
  performance = window.performance

fuzzaldrinPlus = require '../fuzzaldrin'
# legacyPlus = require 'fuzzaldrin-plus'
legacy = require 'fuzzaldrin-plus'

lines = fs.readFileSync(path.join(__dirname, 'data.txt'), 'utf8').trim().split('\n')
forceAllMatch = {maxInners: -1}
mitigation = {maxInners: Math.floor(0.2 * lines.length)}

#warmup + compile
fuzzaldrinPlus.filter(lines, 'index', forceAllMatch)
legacy.filter(lines, 'index')

console.log("======")

startTime = performance.now()
results = fuzzaldrinPlus.filter(lines, 'index')
console.log("Filtering #{lines.length} entries for 'index' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~10% of results are positive, mix exact & fuzzy)")

startTime = performance.now()
results_legacy = legacy.filter(lines, 'index')
console.log("Filtering #{lines.length} entries for 'index' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~10% of results are positive, Legacy method)")

if results.length isnt results_legacy.length
  console.error("Results count changed! #{results.length} instead of #{results_legacy.length}")
  process.exit(1)

console.log("======")

startTime = performance.now()
results = fuzzaldrinPlus.filter(lines, 'indx')
console.log("Filtering #{lines.length} entries for 'indx' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~10% of results are positive, Fuzzy match)")

startTime = performance.now()
results_legacy = legacy.filter(lines, 'indx')
console.log("Filtering #{lines.length} entries for 'indx' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~10% of results are positive, Fuzzy match, Legacy)")

if results.length isnt results_legacy.length
  console.error("Results count changed! #{results.length} instead of #{results_legacy.length}")
  process.exit(1)

console.log("======")

startTime = performance.now()
results = fuzzaldrinPlus.filter(lines, 'walkdr')
console.log("Filtering #{lines.length} entries for 'walkdr' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~1% of results are positive, fuzzy)")

startTime = performance.now()
results_legacy = legacy.filter(lines, 'walkdr')
console.log("Filtering #{lines.length} entries for 'walkdr' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~1% of results are positive, Legacy method)")

if results.length isnt results_legacy.length
  console.error("Results count changed! #{results.length} instead of #{results_legacy.length}")
  process.exit(1)

console.log("======")

startTime = performance.now()
results = fuzzaldrinPlus.filter(lines, 'node', forceAllMatch)
console.log("Filtering #{lines.length} entries for 'node' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~98% of results are positive, mostly Exact match)")

startTime = performance.now()
results_legacy = legacy.filter(lines, 'node')
console.log("Filtering #{lines.length} entries for 'node' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~98% of results are positive, mostly Exact match, Legacy method)")

if results.length isnt results_legacy.length
  console.error("Results count changed! #{results.length} instead of #{results_legacy.length}")
  process.exit(1)

console.log("======")

startTime = performance.now()
results = fuzzaldrinPlus.filter(lines, 'nm', forceAllMatch)
console.log("Filtering #{lines.length} entries for 'nm' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~98% of results are positive, Acronym match)")

startTime = performance.now()
results_legacy = legacy.filter(lines, 'nm')
console.log("Filtering #{lines.length} entries for 'nm' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~98% of results are positive, Acronym match, Legacy method)")

if results.length isnt results_legacy.length
  console.error("Results count changed! #{results.length} instead of #{results_legacy.length}")
  process.exit(1)

console.log("======")

startTime = performance.now()
results = fuzzaldrinPlus.filter(lines, 'nodemodules', forceAllMatch)
console.log("Filtering #{lines.length} entries for 'nodemodules' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~98% positive + Fuzzy match, [Worst case scenario])")

startTime = performance.now()
results = fuzzaldrinPlus.filter(lines, 'nodemodules', mitigation)
console.log("Filtering #{lines.length} entries for 'nodemodules' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~98% positive + Fuzzy match, [Mitigation])")

startTime = performance.now()
results_legacy = legacy.filter(lines, 'nodemodules')
console.log("Filtering #{lines.length} entries for 'nodemodules' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (Legacy)")

if results.length isnt results_legacy.length
  console.error("Results count changed! #{results.length} instead of #{results_legacy.length}")
  process.exit(1)

console.log("======")

startTime = performance.now()
results = fuzzaldrinPlus.filter(lines, 'ndem', forceAllMatch)
console.log("Filtering #{lines.length} entries for 'ndem' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (~98% positive + Fuzzy match, [Worst case but shorter srting])")

startTime = performance.now()
results_legacy = legacy.filter(lines, 'ndem')
console.log("Filtering #{lines.length} entries for 'ndem' took #{Math.round(performance.now() - startTime)}ms for #{results.length} results (Legacy)")

if results.length isnt results_legacy.length
  console.error("Results count changed! #{results.length} instead of #{results_legacy.length}")
  process.exit(1)

console.log("======")

startTime = performance.now()
query = 'index'
prepared = fuzzaldrinPlus.prepareQuery(query)
fuzzaldrinPlus.match(line, query, {preparedQuery: prepared}) for line in lines
console.log("Matching #{lines.length} results for 'index' took #{Math.round(performance.now() - startTime)}ms (Prepare in advance)")

startTime = performance.now()
fuzzaldrinPlus.match(line, query) for line in lines
console.log("Matching #{lines.length} results for 'index' took #{Math.round(performance.now() - startTime)}ms (cache)")
# replace by `prepQuery ?= scorer.prepQuery(query)`to test without cache.

startTime = performance.now()
legacy.match(line, query) for line in lines
console.log("Matching #{lines.length} results for 'index' took #{Math.round(performance.now() - startTime)}ms (legacy)")
# replace by `prepQuery ?= scorer.prepQuery(query)`to test without cache.
