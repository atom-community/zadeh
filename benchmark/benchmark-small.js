require('coffeescript/register')
const fs = require('fs')
const path = require('path')

const performance = (require('perf_hooks')).performance

const fuzzaldrinPlus = require('../fuzzaldrin-dist')
const legacy = require('fuzzaldrin-plus')

const lines = fs.readFileSync(path.join(__dirname, 'data-small.txt'), 'utf8').trim().split('\n')
const forceAllMatch = {
  maxInners: -1
}
const mitigation = {
  maxInners: Math.floor(0.2 * lines.length)
}

// warmup + compile
fuzzaldrinPlus.filter(lines, 'index', forceAllMatch)
legacy.filter(lines, 'index')

function doFilterTest(query) {
  console.log(`====== Running test - query:${query} ======`)
  let startTime = performance.now()
  const res_actual = fuzzaldrinPlus.filter(lines, query)
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

doFilterTest('nm')
doFilterTest('npm')
doFilterTest('node')
doFilterTest('grunt')
doFilterTest('html')
doFilterTest('doc')
doFilterTest('cli')
doFilterTest('js')
doFilterTest('jas')
doFilterTest('mine')
doFilterTest('stream')
