const fs = require("fs")
const path = require("path")
const { averageArray, start_timer, elapsed_time } = require("./testutils")

const { TreeFilterer, filterTree } = require("../index")

const outlineData = JSON.parse(fs.readFileSync(path.join(__dirname, "tree.json"), "utf8"))

// Loading using TreeFilterer
{
  const t1 = start_timer()
  const treeFilterer = new TreeFilterer()
  treeFilterer.setCandidates(outlineData, "plainText", "children")
  elapsed_time(t1, `TreeFilterer.setCandidates:`)

  const t2 = start_timer()
  const out_text = treeFilterer.filterIndices("text")
  const t2_delta = elapsed_time(t2, `TreeFilterer.filterIndices text`)

  //
  const t3 = start_timer()
  const out_dips = treeFilterer.filterIndices("dips")
  const t3_delta = elapsed_time(t3, `TreeFilterer.filterIndices dips`)

  //
  const t4 = start_timer()
  const out_disp = treeFilterer.filterIndices("disp")
  const t4_delta = elapsed_time(t4, `TreeFilterer.filterIndices disp`)

  const t5 = start_timer()
  const out_txt = treeFilterer.filterIndices("txt")
  const t5_delta = elapsed_time(t5, `TreeFilterer.filterIndices txt`)

  const t6 = start_timer()
  const out_getBuffer = treeFilterer.filterIndices("getBuffer")
  const t6_delta = elapsed_time(t6, `TreeFilterer.filterIndices getBuffer`)

  console.log(
    `\nTreeFilterer.filterIndices average: ${" ".repeat(50)} ${averageArray([
      t2_delta,
      t3_delta,
      t4_delta,
      t5_delta,
      t6_delta,
    ]).toFixed(3)} ms\n`
  )
}

// Loading using TreeFilterer
{
  const t1 = start_timer()
  const treeFilterer = new TreeFilterer()
  treeFilterer.setCandidates(outlineData, "plainText", "children")
  elapsed_time(t1, `TreeFilterer.setCandidates:`)

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
}
