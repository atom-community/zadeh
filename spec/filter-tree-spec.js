const {filterTree} = require('../fuzzaldrin-dist')
const DeepEqual = require('deep-equal');

describe("filterTree", () => {
  it("can fuzzy search in an array tree objects", () =>{
    candidates = [
      {data: "bye1", children: [{data: "hello"}]},
      {data: "Bye2", children: [{data: "_bye4"}, {data: "hel"}]},
      {data: "eye"},
    ]

    expect(DeepEqual(
        filterTree(candidates, "hello", "data", "children"),
        [ { data: 'hello', index: 0, level: 1 } ]
      )).toBe(true)

    expect(DeepEqual(
        filterTree(candidates, "hel", "data", "children"),
        [
          { data: 'hel', index: 1, level: 1 },
          { data: 'hello', index: 0, level: 1 }
        ]
      )).toBe(true)

    expect(DeepEqual(
        filterTree(candidates, "he", "data", "children"),
        [
          { data: 'hel', index: 1, level: 1 },
          { data: 'hello', index: 0, level: 1 }
        ]
      )).toBe(true)

    expect(DeepEqual(
        filterTree(candidates, "bye", "data", "children"),
        [
          { data: 'bye1', index: 0, level: 0 },
          { data: '_bye4', index: 0, level: 1 },
          { data: 'Bye2', index: 1, level: 0 }
        ]
      )).toBe(true)

    expect(DeepEqual(
        filterTree(candidates, "ye", "data", "children"),
        process.platform !== "darwin"
        ?
        [
          { data: 'eye', index: 2, level: 0 },
          { data: 'bye1', index: 0, level: 0 },
          { data: 'Bye2', index: 1, level: 0 },
          { data: '_bye4', index: 0, level: 1 }
        ]
        :
        [
          { data: 'eye', index: 2, level: 0 },
          { data: 'Bye2', index: 1, level: 0 },
          { data: 'bye1', index: 0, level: 0 },
          { data: '_bye4', index: 0, level: 1 }
        ]
      )).toBe(true)


    // test maxResults
    expect(DeepEqual(
        filterTree(candidates, "bye", "data", "children", {maxResults: 2}),
        [
          { data: 'bye1', index: 0, level: 0 },
          { data: '_bye4', index: 0, level: 1 },
        ]
      )).toBe(true)


    expect(DeepEqual(
        filterTree(candidates, "ye", "data", "children", {maxResults: 3}),
        process.platform !== "darwin"
        ?
        [
          { data: 'eye', index: 2, level: 0 },
          { data: 'bye1', index: 0, level: 0 },
          { data: 'Bye2', index: 1, level: 0 },
        ]
        :
        [
          { data: 'eye', index: 2, level: 0 },
          { data: 'Bye2', index: 1, level: 0 },
          { data: 'bye1', index: 0, level: 0 }
        ]
      )).toBe(true)

  })

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
