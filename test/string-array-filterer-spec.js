const { StringArrayFilterer } = require("../index")

describe("StringArrayFilterer", function () {
  it("tilres string arrays", function () {
    const arrayFilterer = new StringArrayFilterer()
    arrayFilterer.setCandidates(["Call", "Me", "Maybe"]) // set candidates only once
    // call filter multiple times
    expect(arrayFilterer.filter("me")).toEqual(["Me", "Maybe"])
    expect(arrayFilterer.filter("all")).toEqual(["Call"])
  })
})
