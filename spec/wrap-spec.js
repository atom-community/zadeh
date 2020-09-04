const path = require('path')
const {
  wrap
} = require('../fuzzaldrin-dist')
const legacy = require('fuzzaldrin-plus')

describe("wrap(string, query)", () => {
  const candidates = [
    "helloworld", "Helloworld", "HelloWorld",
    "hello world", "Hello world", "Hello World",
    path.join("hello", "world"),
  ]
  const queries = [
    "he", "hl", "hw", "el", "eo", "ll", "wo", "ld", "", "helloworld",
  ]
  it("returns same for hello world", () => {
    for (const c of candidates) {
      for (const q of queries) {
        expect(wrap(c, q)).toEqual(legacy.wrap(c, q))
      }
    }
  })
})
