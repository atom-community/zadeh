fs = require 'fs'
path = require 'path'

FuzzaldrinPlusFast = require '../fuzzaldrin'
legacy = require 'fuzzaldrin-plus'

lines = fs.readFileSync(path.join(__dirname, 'data-large.txt'), 'utf8').trim().split('\n')
fuzzaldrinplusfast = FuzzaldrinPlusFast.New()
fuzzaldrinplusfast.setCandidates lines

two_letter_tests = [
  'dp', 'la', 'ow', 'rb', 'dg', 'by', 'pf', 'fk', 'qk', 'pu',
  'cl', 'cu', 'cj', 'dz', 'mh', 'sm', 'qk', 'cz', 'nf', 'rb'
]
three_letter_tests = [
  'mxl', 'ipe', 'dvi', 'sxg', 'qiu', 'mvw', 'efa', 'utz', 'pxr', 'dsr',
  'inw', 'xck', 'bqk', 'ibv', 'zbh', 'ozj', 'wht', 'kny', 'ccj', 'dtv'
]


console.time('TwoLetter#legacy')
for query in two_letter_tests
  legacy.filter lines, query, maxResults: 10
console.timeEnd('TwoLetter#legacy')

console.time('TwoLetter#fuzzaldrin-plus-fast')
for query in two_letter_tests
  fuzzaldrinplusfast.filter query, maxResults: 10
console.timeEnd('TwoLetter#fuzzaldrin-plus-fast')
console.log("======")

console.time('ThreeLetter#legacy')
for query in three_letter_tests
  legacy.filter lines, query, maxResults: 10
console.timeEnd('ThreeLetter#legacy')

console.time('ThreeLetter#fuzzaldrin-plus-fast')
for query in three_letter_tests
  fuzzaldrinplusfast.filter query, maxResults: 10
console.timeEnd('ThreeLetter#fuzzaldrin-plus-fast')
console.log("======")

console.time('TwoLetter#fuzzaldrin-plus-fast-filter')
for query in two_letter_tests
  FuzzaldrinPlusFast.filter lines, query, maxResults: 10
console.timeEnd('TwoLetter#fuzzaldrin-plus-fast-filter')
console.log("======")

dict = []
for e in lines
  dict.push {key:e, val:e}
console.time('TwoLetter#Keybased#Filter')
for query in two_letter_tests
  FuzzaldrinPlusFast.filter dict, query, maxResults: 10, key: 'key'
console.timeEnd('TwoLetter#Keybased#Filter')
console.log("======")

# An exmaple run below
# npm run benchmarklarge
#
# > fuzzaldrin-plus-fast@0.0.1 benchmarklarge /home/rajendrant/Downloads/fuzzaldrin-plus-fast
# > coffee benchmark/benchmark-large.coffee
#
# TwoLetter#legacy: 20957.743ms
# TwoLetter#fuzzaldrin-plus-fast: 2503.148ms
# ======
# ThreeLetter#legacy: 16333.060ms
# ThreeLetter#fuzzaldrin-plus-fast: 1999.369ms
# ======
