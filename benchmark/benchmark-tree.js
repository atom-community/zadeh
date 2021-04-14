const fs = require("fs")
const path = require("path")
const { averageArray, start_timer, elapsed_time } = require("./testutils")

const { TreeFilterer, filterTree } = require("../index")

const outlineData = JSON.parse(fs.readFileSync(path.join(__dirname, "tree.json"), "utf8"))

// Loading using TreeFilterer

const t1 = start_timer()
const treeFilterer = new TreeFilterer()
treeFilterer.setCandidates(outlineData, "plainText", "children")
elapsed_time(t1, `TreeFilterer.setCandidates:`)

// Filter using TreeFilterer
const t2 = start_timer()
const out_text = treeFilterer.filter("text")
const t2_delta = elapsed_time(t2, `TreeFilterer.filter text`)

//
const t3 = start_timer()
const out_dips = treeFilterer.filter("dips")
const t3_delta = elapsed_time(t3, `TreeFilterer.filter dips`)

//
const t4 = start_timer()
const out_disp = treeFilterer.filter("disp")
const t4_delta = elapsed_time(t4, `TreeFilterer.filter disp`)

const t5 = start_timer()
const out_txt = treeFilterer.filter("txt")
const t5_delta = elapsed_time(t5, `TreeFilterer.filter txt`)

const t6 = start_timer()
const out_getBuffer = treeFilterer.filter("getBuffer")
const t6_delta = elapsed_time(t6, `TreeFilterer.filter getBuffer`)

console.log(
  `\nTreeFilterer.filter average: ${" ".repeat(57)} ${averageArray([
    t2_delta,
    t3_delta,
    t4_delta,
    t5_delta,
    t6_delta,
  ]).toFixed(3)} ms\n`
)

// filterTree
const t7 = start_timer()
const out_filterTree_text = filterTree(outlineData, "text", "plainText", "children")
const t7_delta = elapsed_time(t7, `filterTree text`)

//
const t8 = start_timer()
const out_filterTree_dips = filterTree(outlineData, "dips", "plainText", "children")
const t8_delta = elapsed_time(t8, `filterTree dips`)

//
const t9 = start_timer()
const out_filterTree_disp = filterTree(outlineData, "disp", "plainText", "children")
const t9_delta = elapsed_time(t9, `filterTree disp`)

const t10 = start_timer()
const out_filterTree_txt = filterTree(outlineData, "txt", "plainText", "children")
const t10_delta = elapsed_time(t10, `filterTree txt:`)

const t11 = start_timer()
const out_filterTree_getBuffer = filterTree(outlineData, "getBuffer", "plainText", "children")
const t11_delta = elapsed_time(t11, `filterTree getBuffer:`)

console.log(
  `\nfilterTree average: ${" ".repeat(66)} ${averageArray([t7_delta, t8_delta, t9_delta, t10_delta, t11_delta]).toFixed(
    3
  )} ms\n`
)
