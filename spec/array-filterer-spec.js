const { ArrayFilterer } = require("../fuzzaldrin-dist")

describe("ArrayFilterer", function () {
  it("is possible to set candidates only once and filter multiple times", function () {
    const arrayFilterer = new ArrayFilterer()
    arrayFilterer.setCandidates(["Call", "Me", "Maybe"]) // set candidates only once
    // call filter multiple times
    expect(arrayFilterer.filter("me")).toEqual(["Me", "Maybe"])
    expect(arrayFilterer.filter("all")).toEqual(["Call"])
  })
})
