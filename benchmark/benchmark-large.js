require('coffeescript/register')
const fs = require('fs')
const path = require('path')
const testutils = require('./testutils')

const FuzzaldrinPlusFast = require('../fuzzaldrin-dist')
const legacy = require('fuzzaldrin-plus')

const lines = fs.readFileSync(path.join(__dirname, 'data-large.txt'), 'utf8').trim().split('\n')
const dict = lines.map((item) => {
  return {
    key: item,
    val: item
  }
})

const fuzzaldrinplusfast = FuzzaldrinPlusFast.New()
fuzzaldrinplusfast.setCandidates(lines)

const two_letter_tests = [
  'dp', 'la', 'ow', 'rb', 'dg', 'by', 'pf', 'fk', 'qk', 'pu',
  'cl', 'cu', 'cj', 'dz', 'mh', 'sm', 'qk', 'cz', 'nf', 'rb'
]
const three_letter_tests = [
  'mxl', 'ipe', 'dvi', 'sxg', 'qiu', 'mvw', 'efa', 'utz', 'pxr', 'dsr',
  'inw', 'xck', 'bqk', 'ibv', 'zbh', 'ozj', 'wht', 'kny', 'ccj', 'dtv'
]


console.time('TwoLetter#legacy')
for (const query of two_letter_tests)
  legacy.filter(lines, query, {
    maxResults: 10
  })
console.timeEnd('TwoLetter#legacy')

console.time('TwoLetter#fuzzaldrin-plus-fast#DirectFilter')
for (const query of two_letter_tests)
  FuzzaldrinPlusFast.filter(lines, query, {
    maxResults: 10
  })
console.timeEnd('TwoLetter#fuzzaldrin-plus-fast#DirectFilter')

console.time('TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter')
for (const query of two_letter_tests)
  fuzzaldrinplusfast.filter(query, {
    maxResults: 10
  })
console.timeEnd('TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter')
console.log("======")


console.time('ThreeLetter#legacy')
for (const query of three_letter_tests)
  legacy.filter(lines, query, {
    maxResults: 10
  })
console.timeEnd('ThreeLetter#legacy')

console.time('ThreeLetter#fuzzaldrin-plus-fast#DirectFilter')
for (const query of three_letter_tests)
  FuzzaldrinPlusFast.filter(lines, query, {
    maxResults: 10
  })
console.timeEnd('ThreeLetter#fuzzaldrin-plus-fast#DirectFilter')

console.time('ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter')
for (const query of three_letter_tests)
  fuzzaldrinplusfast.filter(query, {
    maxResults: 10
  })
console.timeEnd('ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter')
console.log("======")

console.time('TwoLetter#Keybased#Filter')
for (const query of two_letter_tests)
  FuzzaldrinPlusFast.filter(dict, query, {
    maxResults: 10,
    key: 'key'
  })
console.timeEnd('TwoLetter#Keybased#Filter')
console.log("======")


console.time('setCandidates')
let obj = FuzzaldrinPlusFast.New()
obj.setCandidates(lines)
console.timeEnd('setCandidates')

console.time('TwoLetter#Filter')
for (const query of two_letter_tests)
  obj.filter(query, {
    maxResults: 10
  })
console.timeEnd('TwoLetter#Filter')

console.time('ThreeLetter#Filter')
for (const query of three_letter_tests)
  obj.filter(query, {
    maxResults: 10
  })
console.timeEnd('ThreeLetter#Filter')
console.log("======")


console.time('setCandidates#Keybased')
obj = FuzzaldrinPlusFast.New()
obj.setCandidates(dict, {
  key: 'key'
})
console.timeEnd('setCandidates#Keybased')

console.time('TwoLetter#Keybased#Filter')
for (const query of two_letter_tests)
  obj.filter(query, {
    maxResults: 10,
    key: 'key'
  })
console.timeEnd('TwoLetter#Keybased#Filter')

console.time('ThreeLetter#Keybased#Filter')
for (const query of three_letter_tests)
  obj.filter(query, {
    maxResults: 10,
    key: 'key'
  })
console.timeEnd('ThreeLetter#Keybased#Filter')


// An exmaple run below
// TwoLetter#legacy: 20466.854ms
// TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 3362.571ms
// TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 610.414ms
// ======
// ThreeLetter#legacy: 15753.575ms
// ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 3422.584ms
// ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 619.298ms
// ======
// TwoLetter#Keybased#Filter: 4620.753ms
// ======
// setCandidates: 127.881ms
// TwoLetter#Filter: 611.596ms
// ThreeLetter#Filter: 618.661ms
// ======
// setCandidates#Keybased: 176.712ms
// TwoLetter#Keybased#Filter: 621.859ms
// ThreeLetter#Keybased#Filter: 649.107ms
