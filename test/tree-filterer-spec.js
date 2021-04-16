const { TreeFilterer } = require("../index")
const DeepEqual = require("fast-deep-equal")
const fs = require("fs")
const path = require("path")

describe("TreeFilterer", function () {
  const outlineData = JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), "benchmark", "tree.json"), "utf8"))

  describe("TreeFilterer.filterIndices", () => {
    it("can fuzzy search in an array tree objects", () => {
      const treeFilterer = new TreeFilterer()

      const candidates = [
        { data: "bye1", children: [{ data: "hello" }] },
        { data: "Bye2", children: [{ data: "_bye4" }, { data: "hel" }] },
        { data: "eye" },
      ]

      treeFilterer.setCandidates(candidates, "data", "children") // set candidates only once

      // console.log(treeFilterer.filterIndices("hello"))
      expect(DeepEqual(treeFilterer.filterIndices("hello"), [{ data: "hello", index: 0, parent_indices: [0] }])).toBe(
        true
      )

      // console.log(treeFilterer.filterIndices("hel"))
      expect(
        DeepEqual(treeFilterer.filterIndices("hel"), [
          { data: "hel", index: 1, parent_indices: [1] },
          { data: "hello", index: 0, parent_indices: [0] },
        ])
      ).toBe(true)

      // console.log(treeFilterer.filterIndices("he"))
      expect(
        DeepEqual(treeFilterer.filterIndices("he"), [
          { data: "hel", index: 1, parent_indices: [1] },
          { data: "hello", index: 0, parent_indices: [0] },
        ])
      ).toBe(true)

      // console.log(treeFilterer.filterIndices("bye"))
      expect(
        DeepEqual(treeFilterer.filterIndices("bye"), [
          { data: "bye1", index: 0, parent_indices: [] },
          { data: "_bye4", index: 0, parent_indices: [1] },
          { data: "Bye2", index: 1, parent_indices: [] },
        ])
      ).toBe(true)

      // console.log(treeFilterer.filterIndices("ye"))
      expect(
        DeepEqual(treeFilterer.filterIndices("ye"), [
          { data: "eye", index: 2, parent_indices: [] },
          { data: "bye1", index: 0, parent_indices: [] },
          { data: "Bye2", index: 1, parent_indices: [] },
          { data: "_bye4", index: 0, parent_indices: [1] },
        ])
      ).toBe(true)

      // test maxResults
      // console.log(treeFilterer.filterIndices("bye", { maxResults: 2 }))
      expect(
        DeepEqual(treeFilterer.filterIndices("bye", { maxResults: 2 }), [
          { data: "bye1", index: 0, parent_indices: [] },
          { data: "Bye2", index: 1, parent_indices: [] },
        ])
      ).toBe(true)

      // console.log(treeFilterer.filterIndices("ye", { maxResults: 3 }))
      expect(
        DeepEqual(treeFilterer.filterIndices("ye", { maxResults: 3 }), [
          { data: "bye1", index: 0, parent_indices: [] },
          { data: "Bye2", index: 1, parent_indices: [] },
          { data: "_bye4", index: 0, parent_indices: [1] },
        ])
      ).toBe(true)
    })

    it("can search in an array of children-less objects", () => {
      const treeFilterer = new TreeFilterer()
      const candidates = [{ data: "helloworld" }, { data: "bye" }, { data: "hello" }]
      treeFilterer.setCandidates(candidates, "data", "children") // set candidates only once

      // console.log(treeFilterer.filterIndices("hello"))
      expect(
        DeepEqual(treeFilterer.filterIndices("hello"), [
          { data: "hello", index: 2, parent_indices: [] },
          { data: "helloworld", index: 0, parent_indices: [] },
        ])
      ).toBe(true)
    })

    // answers are os dependant because of slight differences
    it("can search in outline data", () => {
      const treeFilterer = new TreeFilterer()
      treeFilterer.setCandidates(outlineData, "plainText", "children")

      // fs.writeFileSync(
      //   path.join(__dirname, "fixtures", "tree-filterIndices-text.json"),
      //   JSON.stringify(treeFilterer.filterIndices("text"))
      // )
      if (process.platform === "win32") {
        const treeFilterIndicesText = JSON.parse(
          fs.readFileSync(path.join(__dirname, "fixtures", "tree-filterIndices-text.json"), "utf8")
        )
        expect(DeepEqual(treeFilterer.filterIndices("text"), treeFilterIndicesText)).toBe(true)
      }

      // fs.writeFileSync(
      //   path.join(__dirname, "fixtures", "tree-filterIndices-disp.json"),
      //   JSON.stringify(treeFilterer.filterIndices("disp"))
      // )
      if (process.platform !== "linux") {
        const treeFilterIndicesDisp = JSON.parse(
          fs.readFileSync(path.join(__dirname, "fixtures", "tree-filterIndices-disp.json"), "utf8")
        )
        expect(DeepEqual(treeFilterer.filterIndices("disp"), treeFilterIndicesDisp)).toBe(true)
      }

      // fs.writeFileSync(
      //   path.join(__dirname, "fixtures", "tree-filterIndices-dips.json"),
      //   JSON.stringify(treeFilterer.filterIndices("dips"))
      // )
      if (process.platform !== "linux") {
        const treeFilterIndicesDips = JSON.parse(
          fs.readFileSync(path.join(__dirname, "fixtures", "tree-filterIndices-dips.json"), "utf8")
        )
        expect(DeepEqual(treeFilterer.filterIndices("dips"), treeFilterIndicesDips)).toBe(true)
      }
    })
  })

  describe("TreeFilterer.filter", () => {
    it("can fuzzy search in an array tree objects", () => {
      const treeFilterer = new TreeFilterer()

      const candidates = [
        { data: "bye1", children: [{ data: "hello" }] },
        { data: "Bye2", children: [{ data: "_bye4" }, { data: "hel" }] },
        { data: "eye" },
      ]

      treeFilterer.setCandidates(candidates, "data", "children") // set candidates only once

      // console.log(JSON.stringify(treeFilterer.filter("hello")))
      expect(DeepEqual(treeFilterer.filter("hello"), [{ data: "bye1", children: [{ data: "hello" }] }])).toBe(true)

      // console.log(JSON.stringify(treeFilterer.filter("hel")))
      expect(
        DeepEqual(treeFilterer.filter("hel"), [
          { data: "Bye2", children: [{ data: "hel" }] },
          { data: "bye1", children: [{ data: "hello" }] },
        ])
      ).toBe(true)

      // console.log(JSON.stringify(treeFilterer.filter("he")))
      expect(
        DeepEqual(treeFilterer.filter("he"), [
          { data: "Bye2", children: [{ data: "hel" }] },
          { data: "bye1", children: [{ data: "hello" }] },
        ])
      ).toBe(true)

      // console.log(JSON.stringify(treeFilterer.filter("bye")))
      expect(
        DeepEqual(treeFilterer.filter("bye"), [
          { data: "bye1", children: [] },
          { data: "Bye2", children: [{ data: "_bye4" }] },
          { data: "Bye2", children: [] },
        ])
      ).toBe(true)

      // console.log(JSON.stringify(treeFilterer.filter("ye")))
      expect(
        DeepEqual(treeFilterer.filter("ye"), [
          { data: "eye", children: [] },
          { data: "bye1", children: [] },
          { data: "Bye2", children: [] },
          { data: "Bye2", children: [{ data: "_bye4" }] },
        ])
      ).toBe(true)

      // test maxResults
      // console.log(JSON.stringify(treeFilterer.filter("bye", { maxResults: 2 })))
      expect(
        DeepEqual(treeFilterer.filter("bye", { maxResults: 2 }), [
          { data: "bye1", children: [] },
          { data: "Bye2", children: [] },
        ])
      ).toBe(true)

      // console.log(JSON.stringify(treeFilterer.filter("ye", { maxResults: 3 })))
      expect(
        DeepEqual(treeFilterer.filter("ye", { maxResults: 3 }), [
          { data: "bye1", children: [] },
          { data: "Bye2", children: [] },
          { data: "Bye2", children: [{ data: "_bye4" }] },
        ])
      ).toBe(true)
    })

    it("can search in an array of children-less objects", () => {
      const treeFilterer = new TreeFilterer()
      const candidates = [{ data: "helloworld" }, { data: "bye" }, { data: "hello" }]
      treeFilterer.setCandidates(candidates, "data", "children") // set candidates only once

      // console.log(JSON.stringify(treeFilterer.filter("hello")))
      expect(
        DeepEqual(treeFilterer.filter("hello"), [
          { data: "hello", children: [] },
          { data: "helloworld", children: [] },
        ])
      ).toBe(true)
    })

    // answers are os dependant because of slight differences
    it("can search in outline data", () => {
      const treeFilterer = new TreeFilterer()
      treeFilterer.setCandidates(outlineData, "plainText", "children")

      // fs.writeFileSync(path.join(__dirname, "fixtures", "tree-filter-text.json"), JSON.stringify(treeFilterer.filter("text")))
      const treeFilterText = JSON.parse(
        fs.readFileSync(path.join(__dirname, "fixtures", "tree-filter-text.json"), "utf8")
      )
      if (process.platform === "win32") {
        expect(DeepEqual(treeFilterer.filter("text"), treeFilterText)).toBe(true)
      }

      // fs.writeFileSync(path.join(__dirname, "fixtures", "tree-filter-disp.json"), JSON.stringify(treeFilterer.filter("disp")))
      if (process.platform !== "linux") {
        const treeFilterDisp = JSON.parse(
          fs.readFileSync(path.join(__dirname, "fixtures", "tree-filter-disp.json"), "utf8")
        )
        expect(DeepEqual(treeFilterer.filter("disp"), treeFilterDisp)).toBe(true)
      }

      // fs.writeFileSync(path.join(__dirname, "fixtures", "tree-filter-dips.json"), JSON.stringify(treeFilterer.filter("dips")))
      if (process.platform !== "linux") {
        const treeFilterDips = JSON.parse(
          fs.readFileSync(path.join(__dirname, "fixtures", "tree-filter-dips.json"), "utf8")
        )
        expect(DeepEqual(treeFilterer.filter("dips"), treeFilterDips)).toBe(true)
      }
    })
  })
})
