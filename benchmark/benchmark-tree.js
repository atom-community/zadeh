const fs = require("fs")
const path = require("path")
const { averageArray } = require("./testutils")

try {
  performance = require("perf_hooks").performance
} catch {
  performance = window.performance
}

const { TreeFilterer, filterTree } = require("../fuzzaldrin-dist")

const outlineData = JSON.parse(fs.readFileSync(path.join(__dirname, "tree.json"), "utf8"))

// Loading using TreeFilterer

let t1 = performance.now()
const treeFilterer = new TreeFilterer()
treeFilterer.setCandidates(outlineData, "plainText", "children")
console.log(`\t TreeFilterer.setCandidates: ${(performance.now() - t1).toFixed(2)} ms`)

// Filter using TreeFilterer
let t2 = performance.now()
const out_text = treeFilterer.filter("text")
let t2_delta = performance.now() - t2
console.log(`TreeFilterer.filter text: ${t2_delta.toFixed(2)} ms`)

//
let t3 = performance.now()
const out_dips = treeFilterer.filter("dips")
let t3_delta = performance.now() - t3
console.log(`TreeFilterer.filter dips: ${t3_delta.toFixed(2)} ms`)

//
let t4 = performance.now()
const out_disp = treeFilterer.filter("disp")
let t4_delta = performance.now() - t4
console.log(`TreeFilterer.filter disp: ${t4_delta.toFixed(2)} ms`)

let t5 = performance.now()
const out_txt = treeFilterer.filter("txt")
let t5_delta = performance.now() - t5
console.log(`TreeFilterer.filter txt: ${t5_delta.toFixed(2)} ms`)

let t6 = performance.now()
const out_getBuffer = treeFilterer.filter("getBuffer")
let t6_delta = performance.now() - t6
console.log(`TreeFilterer.filter getBuffer: ${t6_delta.toFixed(2)} ms`)

console.log(
  `\t TreeFilterer.filter average: ${averageArray([t2_delta, t3_delta, t4_delta, t5_delta, t6_delta]).toFixed(3)} ms`
)

// filterTree
let t7 = performance.now()
const out_filterTree_text = filterTree(outlineData, "text", "plainText", "children")
let t7_delta = performance.now() - t7
console.log(`filterTree text: ${t7_delta.toFixed(2)} ms`)

//
let t8 = performance.now()
const out_filterTree_dips = filterTree(outlineData, "dips", "plainText", "children")
let t8_delta = performance.now() - t8
console.log(`filterTree dips: ${t8_delta.toFixed(2)} ms`)

//
let t9 = performance.now()
const out_filterTree_disp = filterTree(outlineData, "disp", "plainText", "children")
let t9_delta = performance.now() - t9
console.log(`filterTree disp: ${t9_delta.toFixed(2)} ms`)

let t10 = performance.now()
const out_filterTree_txt = filterTree(outlineData, "txt", "plainText", "children")
let t10_delta = performance.now() - t10
console.log(`filterTree txt: ${t10_delta.toFixed(2)} ms`)

let t11 = performance.now()
const out_filterTree_getBuffer = filterTree(outlineData, "getBuffer", "plainText", "children")
let t11_delta = performance.now() - t11
console.log(`filterTree getBuffer: ${t11_delta.toFixed(2)} ms`)

console.log(
  `\t filterTree average: ${averageArray([t7_delta, t8_delta, t9_delta, t10_delta, t11_delta]).toFixed(3)} ms`
)
