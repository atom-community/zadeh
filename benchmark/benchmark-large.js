require("coffeescript/register")
const fs = require("fs")
const path = require("path")
const { elapsed_time, start_timer } = require("./testutils")

const Zadeh = require("../index")
const legacy = require("fuzzaldrin-plus")

const lines = fs.readFileSync(path.join(__dirname, "data-large.txt"), "utf8").trim().split("\n")
const dict = lines.map((item) => {
  return {
    key: item,
    val: item,
  }
})

const zadeh = Zadeh.New()
zadeh.setCandidates(lines)

const two_letter_tests = [
  "dp",
  "la",
  "ow",
  "rb",
  "dg",
  "by",
  "pf",
  "fk",
  "qk",
  "pu",
  "cl",
  "cu",
  "cj",
  "dz",
  "mh",
  "sm",
  "qk",
  "cz",
  "nf",
  "rb",
]
const three_letter_tests = [
  "mxl",
  "ipe",
  "dvi",
  "sxg",
  "qiu",
  "mvw",
  "efa",
  "utz",
  "pxr",
  "dsr",
  "inw",
  "xck",
  "bqk",
  "ibv",
  "zbh",
  "ozj",
  "wht",
  "kny",
  "ccj",
  "dtv",
]

const t1 = start_timer()
for (const query of two_letter_tests) {
  legacy.filter(lines, query, {
    maxResults: 10,
  })
}
elapsed_time(t1, "TwoLetter _legacy_")

const t2 = start_timer()
for (const query of two_letter_tests) {
  Zadeh.filter(lines, query, {
    maxResults: 10,
  })
}
elapsed_time(t2, "TwoLetter direct filter")

const t3 = start_timer()
for (const query of two_letter_tests) {
  zadeh.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t3, "TwoLetter setCandidates")

console.log("======")

const t4 = start_timer()
for (const query of three_letter_tests) {
  legacy.filter(lines, query, {
    maxResults: 10,
  })
}
elapsed_time(t4, "ThreeLetter _legacy_")

const t5 = start_timer()
for (const query of three_letter_tests) {
  Zadeh.filter(lines, query, {
    maxResults: 10,
  })
}
elapsed_time(t5, "ThreeLetter direct filter")

const t6 = start_timer()
for (const query of three_letter_tests) {
  zadeh.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t6, "ThreeLetter setCandidates")

console.log("======")

const t7 = start_timer()
for (const query of two_letter_tests) {
  Zadeh.filter(dict, query, {
    maxResults: 10,
    key: "key",
  })
}
elapsed_time(t7, "TwoLetter keybased filter")

const t8 = start_timer()
for (const query of three_letter_tests) {
  Zadeh.filter(dict, query, {
    maxResults: 10,
    key: "key",
  })
}
elapsed_time(t8, "ThreeLetter keybased filter")

console.log("======")

const t9 = start_timer()
let obj = Zadeh.New()
obj.setCandidates(lines)
elapsed_time(t9, "setCandidates")

const t10 = start_timer()
for (const query of two_letter_tests) {
  obj.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t10, "TwoLetter filter")

const t11 = start_timer()
for (const query of three_letter_tests) {
  obj.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t11, "ThreeLetter filter")

console.log("======")

const t12 = start_timer()
obj = Zadeh.New()
obj.setCandidates(dict, {
  key: "key",
})
elapsed_time(t12, "setCandidates keybased")

const t13 = start_timer()
for (const query of two_letter_tests) {
  obj.filter(query, {
    maxResults: 10,
    key: "key",
  })
}
elapsed_time(t13, "TwoLetter keybased filter")

const t14 = start_timer()
for (const query of three_letter_tests) {
  obj.filter(query, {
    maxResults: 10,
    key: "key",
  })
}
elapsed_time(t14, "ThreeLetter keybased filter")
