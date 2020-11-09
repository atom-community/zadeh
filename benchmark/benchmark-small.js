require("coffeescript/register")
const fs = require("fs")
const path = require("path")
const testutils = require("./testutils")

const fuzzaldrinPlus = require("../fuzzaldrin-dist")
const legacy = require("fuzzaldrin-plus")

const lines = fs.readFileSync(path.join(__dirname, "data-small.txt"), "utf8").trim().split("\n")
const forceAllMatch = {
  maxInners: -1,
}
const mitigation = {
  maxInners: Math.floor(0.2 * lines.length),
}

// warmup + compile
fuzzaldrinPlus.filter(lines, "index", forceAllMatch)
legacy.filter(lines, "index")

testutils.doFilterTest(null, lines, "nm")
testutils.doFilterTest(null, lines, "npm")
testutils.doFilterTest(null, lines, "node")
testutils.doFilterTest(null, lines, "grunt")
testutils.doFilterTest(null, lines, "html")
testutils.doFilterTest(null, lines, "doc")
testutils.doFilterTest(null, lines, "cli")
testutils.doFilterTest(null, lines, "js")
testutils.doFilterTest(null, lines, "jas")
testutils.doFilterTest(null, lines, "mine")
testutils.doFilterTest(null, lines, "stream")
