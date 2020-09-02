require('coffeescript/register')
const fs = require('fs')
const path = require('path')

let performance = null

try {
  performance = (require('perf_hooks')).performance
} catch {
  performance = window.performance
}

const fuzzaldrinPlus = require('../fuzzaldrin-dist')
const legacy = require('fuzzaldrin-plus')

const lines = fs.readFileSync(path.join(__dirname, 'data.txt'), 'utf8').trim().split('\n')
const forceAllMatch = {
  maxInners: -1
}
const mitigation = {
  maxInners: Math.floor(0.2 * lines.length)
}

// warmup + compile
fuzzaldrinPlus.filter(lines, 'index', forceAllMatch)
legacy.filter(lines, 'index')

function doFilterTest(test_name, query, params) {
  console.log(`====== Running test - query:${query} ======`)
  let startTime = performance.now()
  const res_actual = fuzzaldrinPlus.filter(lines, query, params)
  const elapsed = Math.round(performance.now() - startTime)

  startTime = performance.now()
  const res_expected = legacy.filter(lines, query)
  const elapsed_legacy = Math.round(performance.now() - startTime)

  if (res_actual.length != res_expected.length) {
    console.error("Results count changed! #{results.length} instead of #{results_legacy.length}")
    process.exit(1)
  }

  console.log(`Elapsed time - fuzzaldrin-plus-fast: ${elapsed} ms vs. fuzzaldrin-plus: ${elapsed_legacy} ms`)
  if (elapsed > elapsed_legacy) {
    console.error(`====== fuzzaldrin-plus-fast is SLOWER`)
  }
  console.log('')
}

doFilterTest('~10% of results are positive, mix exact & fuzzy', 'index')
doFilterTest('~10% of results are positive, Fuzzy match', 'indx')
doFilterTest('~1% of results are positive, fuzzy', 'walkdr')
doFilterTest('~98% of results are positive, mostly Exact match', 'node', forceAllMatch)
doFilterTest('~98% of results are positive, Acronym match', 'nm')
doFilterTest('~98% of results + Fuzzy match, [Worst case scenario]', 'nm', forceAllMatch)
doFilterTest('~98% of results + Fuzzy match, [Mitigation]', 'nm', mitigation)
doFilterTest('~98% of results + Fuzzy match, [Worst case but shorter string]', 'ndem', forceAllMatch)


const query = 'index'
let startTime = performance.now()
prepared = fuzzaldrinPlus.prepareQuery(query)
for (const line of lines) {
  fuzzaldrinPlus.match(line, query, {
    preparedQuery: prepared
  })
}
console.log(`Matching ${lines.length} results for 'index' took ${Math.round(performance.now() - startTime)}ms (Prepare in advance)`)

startTime = performance.now()
for (const line of lines) {
  fuzzaldrinPlus.match(line, query)
}
console.log(`Matching ${lines.length} results for 'index' took ${Math.round(performance.now() - startTime)}ms (cache)`)
// replace by 'prepQuery ?= scorer.prepQuery(query)' to test without cache.

startTime = performance.now()
for (const line of lines) {
  legacy.match(line, query)
}
console.log(`Matching ${lines.length} results for 'index' took ${Math.round(performance.now() - startTime)}ms (legacy)`)
// replace by `prepQuery ? = scorer.prepQuery(query) to test without cache.
