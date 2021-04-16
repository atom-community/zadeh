const { TreeFilterer } = require("../index")
const DeepEqual = require("fast-deep-equal")
const assert = require("assert")

async function main() {
  // await sleep()
  console.log("start")

  const treeFilterer = new TreeFilterer()

  const candidates = [
    { data: "bye1", children: [{ data: "hello" }] },
    { data: "Bye2", children: [{ data: "_bye4" }, { data: "hel" }] },
    { data: "eye" },
  ]
  const condidatesCopy = {...candidates}

  treeFilterer.setCandidates(candidates, "data", "children") // set candidates only once
  // console.log(treeFilterer.filter("hello"))
  console.log("candidates ", JSON.stringify(candidates))
  const x1 = treeFilterer.filter("hel")
  console.log("x1 ", JSON.stringify(x1))
  console.log("candidates ", JSON.stringify(candidates))

  console.log("candidates ", JSON.stringify(candidates))
  const x2 = treeFilterer.filter("he")
  console.log("x2 ", JSON.stringify(x2))
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
