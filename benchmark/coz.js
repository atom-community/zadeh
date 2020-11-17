const fuzzaldrinPlus = require("../fuzzaldrin-dist")
const fs = require("fs")
const path = require("path")

const lines = fs.readFileSync(path.join(__dirname, "data.txt"), "utf8").trim().split("\n")

function coz() {
  fuzzaldrinPlus.cozProgress()
  return fuzzaldrinPlus.filter(lines, "index")
}

coz()
