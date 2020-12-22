require("coffeescript/register")
const fs = require("fs")
const path = require("path")
const { start_timer, elapsed_time, doFilterTest } = require("./testutils")

const fuzzaldrinPlus = require("../node-dist")
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

doFilterTest("~10% of results are positive, mix exact & fuzzy", lines, "index")
doFilterTest("~10% of results are positive, Fuzzy match", lines, "indx")
doFilterTest("~1% of results are positive, fuzzy", lines, "walkdr")
doFilterTest("~98% of results are positive, mostly Exact match", lines, "node", forceAllMatch)
doFilterTest("~98% of results are positive, Acronym match", lines, "nm")
doFilterTest("~98% of results + Fuzzy match, [Worst case scenario]", lines, "nm", forceAllMatch)
doFilterTest("~98% of results + Fuzzy match, [Mitigation]", lines, "nm", mitigation)
doFilterTest("~98% of results + Fuzzy match, [Worst case but shorter string]", lines, "ndem", forceAllMatch)

const query = "index"
const t1 = start_timer()
const prepared = fuzzaldrinPlus.prepareQuery(query)
for (const line of lines) {
  fuzzaldrinPlus.match(line, query, {
    preparedQuery: prepared,
  })
}
elapsed_time(t1, `Matching ${lines.length} results for 'index' (Prepare in advance)`)

const t2 = start_timer()
for (const line of lines) {
  fuzzaldrinPlus.match(line, query)
}
elapsed_time(t2, `Matching ${lines.length} results for 'index' (cache)`)
// replace by 'prepQuery ?= scorer.prepQuery(query)' to test without cache.

const t3 = start_timer()
for (const line of lines) {
  legacy.match(line, query)
}
elapsed_time(t3, `Matching ${lines.length} results for 'index' (_legacy_)`)
// replace by `prepQuery ? = scorer.prepQuery(query) to test without cache.
