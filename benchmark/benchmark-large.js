require("coffeescript/register")
const fs = require("fs")
const path = require("path")
const { elapsed_time, start_timer } = require("./testutils")

const { StringArrayFilterer, ObjectArrayFilterer, filter } = require("../index")
const legacy = require("fuzzaldrin-plus")

const lines = fs.readFileSync(path.join(__dirname, "data-large.txt"), "utf8").trim().split("\n")
const dict = lines.map((item) => {
  return {
    key: item,
    val: item,
  }
})

const arrFilterer = new StringArrayFilterer(lines)

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
  filter(lines, query, {
    maxResults: 10,
  })
}
elapsed_time(t2, "TwoLetter deprecated filter")

const t3 = start_timer()
for (const query of two_letter_tests) {
  arrFilterer.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t3, "TwoLetter StringArrayFilterer.filter")

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
  filter(lines, query, {
    maxResults: 10,
  })
}
elapsed_time(t5, "ThreeLetter deprecated filter")

const t6 = start_timer()
for (const query of three_letter_tests) {
  arrFilterer.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t6, "ThreeLetter StringArrayFilterer.filter")

console.log("======")
const obj = new ObjectArrayFilterer(dict, "key")

const t7 = start_timer()
for (const query of two_letter_tests) {
  obj.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t7, "TwoLetter object filter")

const t8 = start_timer()
for (const query of three_letter_tests) {
  obj.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t8, "ThreeLetter object filter")

const t71 = start_timer()
for (const query of two_letter_tests) {
  filter(dict, query, {
    maxResults: 10,
    key: "key",
  })
}
elapsed_time(t71, "TwoLetter object deprecated filter")

const t81 = start_timer()
for (const query of three_letter_tests) {
  filter(dict, query, {
    maxResults: 10,
    key: "key",
  })
}
elapsed_time(t81, "ThreeLetter object deprecated filter")

console.log("======")

const t9 = start_timer()
const obj_1 = new StringArrayFilterer(lines)
elapsed_time(t9, "StringArrayFilterer constructor")

const t10 = start_timer()
for (const query of two_letter_tests) {
  obj_1.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t10, "TwoLetter StringArrayFilterer.filter")

const t11 = start_timer()
for (const query of three_letter_tests) {
  obj_1.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t11, "ThreeLetter StringArrayFilterer.filter")

console.log("======")

const t12 = start_timer()
const obj_2 = new ObjectArrayFilterer(dict, "key")
elapsed_time(t12, "ObjectArrayFilterer constructor")

const t13 = start_timer()
for (const query of two_letter_tests) {
  obj_2.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t13, "TwoLetter ObjectArrayFilterer.filter")

const t14 = start_timer()
for (const query of three_letter_tests) {
  obj_2.filter(query, {
    maxResults: 10,
  })
}
elapsed_time(t14, "ThreeLetter ObjectArrayFilterer.filter")
