const { ObjectArrayFilterer } = require("../index")

describe("ObjectArrayFilterer", function () {
  it("filters object arrays", function () {
    const candidates = [
      {name: 'Call', id: 1},
      {name: 'Me', id: 2},
      {name: 'Maybe', id: 3}
    ]
    const objArrFilterer = new ObjectArrayFilterer(candidates, "name") // filter based on their name
    // call filter multiple times
    expect(objArrFilterer.filter("me")).toEqual([{ name: 'Me', id: 2 }, { name: 'Maybe', id: 3}])
    expect(objArrFilterer.filter("all")).toEqual([{ name: 'Call', id: 1 }])
  })
})
