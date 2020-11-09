require("coffeescript/register")
const fs = require("fs")
const path = require("path")
const testutils = require("./testutils")

const fuzzaldrinPlus = require("../fuzzaldrin-dist")
const legacy = require("fuzzaldrin-plus")

const lines = fs.readFileSync(path.join(__dirname, "data.txt"), "utf8").trim().split("\n")
const forceAllMatch = {
  maxInners: -1,
}
const mitigation = {
  maxInners: Math.floor(0.2 * lines.length),
}

// warmup + compile
fuzzaldrinPlus.filter(lines, "index", forceAllMatch)
legacy.filter(lines, "index")

testutils.doFilterTest("~10% of results are positive, mix exact & fuzzy", lines, "index")
testutils.doFilterTest("~10% of results are positive, Fuzzy match", lines, "indx")
testutils.doFilterTest("~1% of results are positive, fuzzy", lines, "walkdr")
testutils.doFilterTest("~98% of results are positive, mostly Exact match", lines, "node", forceAllMatch)
testutils.doFilterTest("~98% of results are positive, Acronym match", lines, "nm")
testutils.doFilterTest("~98% of results + Fuzzy match, [Worst case scenario]", lines, "nm", forceAllMatch)
testutils.doFilterTest("~98% of results + Fuzzy match, [Mitigation]", lines, "nm", mitigation)
testutils.doFilterTest("~98% of results + Fuzzy match, [Worst case but shorter string]", lines, "ndem", forceAllMatch)

const query = "index"
testutils.start_timer()
prepared = fuzzaldrinPlus.prepareQuery(query)
for (const line of lines) {
  fuzzaldrinPlus.match(line, query, {
    preparedQuery: prepared,
  })
}
console.log(`Matching ${lines.length} results for 'index' took ${testutils.elapsed_time()}ms (Prepare in advance)`)

testutils.start_timer()
for (const line of lines) {
  fuzzaldrinPlus.match(line, query)
}
console.log(`Matching ${lines.length} results for 'index' took ${testutils.elapsed_time()}ms (cache)`)
// replace by 'prepQuery ?= scorer.prepQuery(query)' to test without cache.

testutils.start_timer()
for (const line of lines) {
  legacy.match(line, query)
}
console.log(`Matching ${lines.length} results for 'index' took ${testutils.elapsed_time()}ms (legacy)`)
// replace by `prepQuery ? = scorer.prepQuery(query) to test without cache.
