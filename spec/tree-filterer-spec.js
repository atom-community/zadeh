const { TreeFilterer } = require("../fuzzaldrin-dist")
const DeepEqual = require("deep-equal")

describe("ArrayFilterer", function () {
  it("is possible to set candidates only once and filter multiple times", function () {
    const arrayFilterer = new TreeFilterer()

    const candidates = [
      { data: "bye1", children: [{ data: "hello" }] },
      { data: "Bye2", children: [{ data: "_bye4" }, { data: "hel" }] },
      { data: "eye" },
    ]
    arrayFilterer.setCandidates(candidates, "data", "children") // set candidates only once

    // call filter multiple times

    expect(DeepEqual(arrayFilterer.filter("hello"), [{ data: "hello", index: 0, level: 1 }])).toBe(true)

    expect(
      DeepEqual(arrayFilterer.filter("bye"), [
        { data: "bye1", index: 0, level: 0 },
        { data: "_bye4", index: 0, level: 1 },
        { data: "Bye2", index: 1, level: 0 },
      ])
    ).toBe(true)
  })
})
