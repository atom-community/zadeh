const {filterTree} = require('../fuzzaldrin-dist')
const DeepEqual = require('deep-equal');

describe("filterTree", () => {
  it("can search in an array of children-less objects", () =>{
    const candidates = [
      {data: "helloworld"},
      {data: "bye"},
      {data: "hello"},
    ]
    expect(DeepEqual(
        filterTree(candidates, "hello", "data", "children"),
        [
          { data: 'hello', index: 2, level: 0 },
          { data: 'helloworld', index: 0, level: 0 },
        ]
      )).toBe(true)

    // test default values
    expect(DeepEqual(
        filterTree(candidates, "hello"),
        [
          { data: 'hello', index: 2, level: 0 },
          { data: 'helloworld', index: 0, level: 0 },
        ]
      )).toBe(true)
  })

})
