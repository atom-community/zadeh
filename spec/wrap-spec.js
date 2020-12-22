const path = require("path")
const { wrap } = require("../node-dist")
const legacy = require("fuzzaldrin-plus")

describe("wrap(string, query)", () => {
  const candidates = [
    "helloworld",
    "Helloworld",
    "HelloWorld",
    "hello world",
    "Hello world",
    "Hello World",
    path.join("hello", "world"),
  ]
  const queries = ["he", "hl", "hw", "el", "eo", "ll", "wo", "ld", "", "helloworld"]
  for (const c of candidates) {
    for (const q of queries) {
      it("returns same for " + c, () => {
        expect(wrap(c, q)).toEqual(legacy.wrap(c, q))
      })
    }
  }
})
