const { TreeFilterer } = require("../index")
const fs = require("fs")
const path = require("path")

async function main() {
  // await sleep()
  console.log("start")

  const treeFilterer = new TreeFilterer()

  const candidates = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "small-tree.json"), "utf8"))

  treeFilterer.setCandidates(candidates, "plainText", "children") // set candidates only once
  const filteredIndices = treeFilterer.filterIndices("pl")
  const filtered = treeFilterer.filter("pl")

  console.log("candidates", candidates)
  console.log("filteredIndices ", filteredIndices)
  console.log(JSON.stringify(filtered, undefined, " "))
}

main().catch((e) => {
  throw e
})

async function sleep() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, 10000)
  })
}
