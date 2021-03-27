"use babel"
import { createRunner } from "atom-jasmine3-test-runner"

// https://github.com/UziTech/atom-jasmine3-test-runner#api
export default createRunner({
  testPackages: getPackageDeps(),
  timeReporter: true,
  specHelper: true,
})

function getPackageDeps() {
  const pkg = require("../package.json")
  return Array.from(pkg["package-deps"] || []).map((p) => p.name || p) || []
}
