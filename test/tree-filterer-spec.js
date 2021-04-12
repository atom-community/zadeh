const { TreeFilterer } = require("../index")
const DeepEqual = require("deep-equal")
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

      // console.log(treeFilterer.filterIndices("text"))
      if (process.platform === "win32") {
        expect(
          DeepEqual(treeFilterer.filterIndices("text"), [
            { data: "text", index: 0, parent_indices: [0, 31, 160, 0] },
            { data: "text", index: 0, parent_indices: [0, 31, 158, 0] },
            { data: "text", index: 0, parent_indices: [0, 30, 0, 160, 0] },
            { data: "text", index: 0, parent_indices: [0, 30, 0, 158, 0] },
            { data: "text", index: 2, parent_indices: [0, 31, 353, 2] },
            { data: "text", index: 2, parent_indices: [0, 30, 0, 353, 2] },
            { data: "textEditor", index: 3, parent_indices: [0, 31, 107] },
            { data: "textEditor", index: 3, parent_indices: [0, 30, 0, 107] },
            { data: "textToDuplicate", index: 10, parent_indices: [0, 30, 0, 157, 0] },
            { data: "textToDuplicate", index: 10, parent_indices: [0, 31, 157, 0] },
            { data: "getText", index: 119, parent_indices: [0, 31] },
            { data: "setText", index: 146, parent_indices: [0, 31] },
            { data: "setText", index: 146, parent_indices: [0, 30, 0] },
            { data: "getText", index: 119, parent_indices: [0, 30, 0] },
            { data: "lineText", index: 3, parent_indices: [0, 31, 129] },
            { data: "lineText", index: 3, parent_indices: [0, 30, 0, 129] },
            { data: "TextEditor", index: 0, parent_indices: [0, 30] },
            { data: "TextBuffer", index: 8, parent_indices: [0] },
            { data: "TextEditor", index: 31, parent_indices: [0] },
            { data: "pasteText", index: 353, parent_indices: [0, 30, 0] },
            { data: "pasteText", index: 353, parent_indices: [0, 31] },
            { data: "insertText", index: 148, parent_indices: [0, 30, 0] },
            { data: "insertText", index: 148, parent_indices: [0, 31] },
            { data: "getTabText", index: 323, parent_indices: [0, 30, 0] },
            { data: "getTabText", index: 323, parent_indices: [0, 31] },
            { data: "lineTextIndex", index: 1, parent_indices: [0, 31, 129] },
            { data: "lineTextIndex", index: 1, parent_indices: [0, 30, 0, 129] },
            { data: "getTextInRange", index: 141, parent_indices: [0, 31] },
            { data: "getTextInRange", index: 141, parent_indices: [0, 30, 0] },
            { data: "clipboardText", index: 0, parent_indices: [0, 30, 0, 353] },
            { data: "clipboardText", index: 0, parent_indices: [0, 31, 353] },
            { data: "TextEditorElement", index: 20, parent_indices: [0] },
            { data: "TextEditorComponent", index: 19, parent_indices: [0] },
            { data: "onDidInsertText", index: 67, parent_indices: [0, 31] },
            { data: "onDidInsertText", index: 67, parent_indices: [0, 30, 0] },
            { data: "getSelectedText", index: 252, parent_indices: [0, 31] },
            { data: "cutSelectedText", index: 352, parent_indices: [0, 31] },
            { data: "cutSelectedText", index: 352, parent_indices: [0, 30, 0] },
            { data: "getSelectedText", index: 252, parent_indices: [0, 30, 0] },
            { data: "TextMateLanguageMode", index: 15, parent_indices: [0] },
            { data: "onWillInsertText", index: 66, parent_indices: [0, 31] },
            { data: "onWillInsertText", index: 66, parent_indices: [0, 30, 0] },
            { data: "copySelectedText", index: 350, parent_indices: [0, 31] },
            { data: "copySelectedText", index: 350, parent_indices: [0, 30, 0] },
            { data: "TextMateScopeSelector", index: 17, parent_indices: [0] },
            { data: "getTextInBufferRange", index: 120, parent_indices: [0, 30, 0] },
            { data: "setTextInBufferRange", index: 147, parent_indices: [0, 31] },
            { data: "setTextInBufferRange", index: 147, parent_indices: [0, 30, 0] },
            { data: "getTextInBufferRange", index: 120, parent_indices: [0, 31] },
            { data: "lineTextForBufferRow", index: 126, parent_indices: [0, 30, 0] },
            { data: "lineTextForScreenRow", index: 127, parent_indices: [0, 31] },
            { data: "lineTextForBufferRow", index: 126, parent_indices: [0, 31] },
            { data: "lineTextForScreenRow", index: 127, parent_indices: [0, 30, 0] },
            { data: "mutateSelectedText", index: 152, parent_indices: [0, 31] },
            { data: "mutateSelectedText", index: 152, parent_indices: [0, 30, 0] },
            { data: "getPlaceholderText", index: 402, parent_indices: [0, 30, 0] },
            { data: "setPlaceholderText", index: 403, parent_indices: [0, 30, 0] },
            { data: "getPlaceholderText", index: 402, parent_indices: [0, 31] },
            { data: "setPlaceholderText", index: 403, parent_indices: [0, 31] },
            { data: "replaceSelectedText", index: 158, parent_indices: [0, 30, 0] },
            { data: "replaceSelectedText", index: 158, parent_indices: [0, 31] },
            { data: "copyOnlySelectedText", index: 351, parent_indices: [0, 31] },
            { data: "copyOnlySelectedText", index: 351, parent_indices: [0, 30, 0] },
            { data: "updatePlaceholderText", index: 33, parent_indices: [0, 30, 0] },
            { data: "updatePlaceholderText", index: 33, parent_indices: [0, 31] },
            { data: "charTextToLeftOfSelection", index: 2, parent_indices: [0, 30, 0, 155, 4] },
            { data: "charTextToLeftOfSelection", index: 2, parent_indices: [0, 31, 155, 4] },
            { data: "emitWillInsertTextEvent", index: 450, parent_indices: [0, 30, 0] },
            { data: "emitWillInsertTextEvent", index: 450, parent_indices: [0, 31] },
            { data: "charTextToRightOfSelection", index: 2, parent_indices: [0, 30, 0, 156, 4] },
            { data: "charTextToRightOfSelection", index: 2, parent_indices: [0, 31, 156, 4] },
            { data: "onDidChangePlaceholderText", index: 80, parent_indices: [0, 30, 0] },
            { data: "onDidChangePlaceholderText", index: 80, parent_indices: [0, 31] },
            { data: "deleteToNextWordBoundary", index: 169, parent_indices: [0, 30, 0] },
            { data: "deleteToNextWordBoundary", index: 169, parent_indices: [0, 31] },
            { data: "moveToNextWordBoundary", index: 238, parent_indices: [0, 30, 0] },
            { data: "moveToNextWordBoundary", index: 238, parent_indices: [0, 31] },
            { data: "moveToNextSubwordBoundary", index: 240, parent_indices: [0, 31] },
            { data: "moveToNextSubwordBoundary", index: 240, parent_indices: [0, 30, 0] },
            { data: "selectToNextWordBoundary", index: 282, parent_indices: [0, 31] },
            { data: "selectToNextWordBoundary", index: 282, parent_indices: [0, 30, 0] },
            { data: "selectToNextSubwordBoundary", index: 278, parent_indices: [0, 31] },
            { data: "selectToNextSubwordBoundary", index: 278, parent_indices: [0, 30, 0] },
            { data: "moveToBeginningOfNextWord", index: 236, parent_indices: [0, 30, 0] },
            { data: "moveToBeginningOfNextWord", index: 236, parent_indices: [0, 31] },
            { data: "selectToBeginningOfNextWord", index: 283, parent_indices: [0, 31] },
            { data: "selectToBeginningOfNextWord", index: 283, parent_indices: [0, 30, 0] },
            { data: "moveToBeginningOfNextParagraph", index: 241, parent_indices: [0, 30, 0] },
            { data: "moveToBeginningOfNextParagraph", index: 241, parent_indices: [0, 31] },
            { data: "selectToBeginningOfNextParagraph", index: 284, parent_indices: [0, 30, 0] },
            { data: "selectToBeginningOfNextParagraph", index: 284, parent_indices: [0, 31] },
            { data: "firstExistingFoldRange", index: 4, parent_indices: [0, 30, 0, 358] },
            { data: "firstExistingFoldRange", index: 4, parent_indices: [0, 31, 358] },
            { data: "updateMaxScreenLineLength", index: 29, parent_indices: [0, 30, 0] },
            { data: "updateMaxScreenLineLength", index: 29, parent_indices: [0, 31] },
          ])
        ).toBe(true)
      }

      // console.log(treeFilterer.filter("disp"))
      if (process.platform !== "linux") {
        expect(
          DeepEqual(treeFilterer.filterIndices("disp"), [
            { data: "disposable", index: 3, parent_indices: [0, 30, 0, 5] },
            { data: "disposable", index: 3, parent_indices: [0, 31, 5] },
            { data: "displayLayer", index: 0, parent_indices: [0, 30, 0, 87] },
            { data: "displayLayer", index: 0, parent_indices: [0, 31, 87] },
            { data: "displayBuffer", index: 9, parent_indices: [0, 30, 0] },
            { data: "displayBuffer", index: 9, parent_indices: [0, 31] },
            { data: "displayLayerParams", index: 5, parent_indices: [0, 30, 0, 6] },
            { data: "displayLayerParams", index: 0, parent_indices: [0, 30, 0, 15] },
            { data: "displayLayerParams", index: 5, parent_indices: [0, 31, 6] },
            { data: "displayLayerParams", index: 0, parent_indices: [0, 31, 15] },
            { data: "Disposable", index: 6, parent_indices: [0] },
            { data: "CompositeDisposable", index: 5, parent_indices: [0] },
            { data: "subscribeToDisplayLayer", index: 50, parent_indices: [0, 30, 0] },
            { data: "subscribeToDisplayLayer", index: 50, parent_indices: [0, 31] },
            { data: "onDidStopChanging", index: 57, parent_indices: [0, 30, 0] },
            { data: "onDidStopChanging", index: 57, parent_indices: [0, 31] },
            { data: "onDidChangeScrollTop", index: 81, parent_indices: [0, 30, 0] },
            { data: "onDidChangeScrollTop", index: 81, parent_indices: [0, 31] },
            { data: "onDidChangeSoftWrapped", index: 60, parent_indices: [0, 30, 0] },
            { data: "onDidChangeSoftWrapped", index: 60, parent_indices: [0, 31] },
            { data: "onDidChangeCursorPosition", index: 58, parent_indices: [0, 30, 0] },
            { data: "onDidChangeCursorPosition", index: 58, parent_indices: [0, 31] },
          ])
        ).toBe(true)
      }

      // console.log(treeFilterer.filter("dips"))
      if (process.platform !== "linux") {
        expect(
          DeepEqual(treeFilterer.filterIndices("dips"), [
            { data: "didUpdateStyles", index: 2, parent_indices: [0, 30, 0] },
            { data: "didUpdateStyles", index: 2, parent_indices: [0, 31] },
            { data: "displayLayerParams", index: 5, parent_indices: [0, 30, 0, 6] },
            { data: "displayLayerParams", index: 0, parent_indices: [0, 30, 0, 15] },
            { data: "displayLayerParams", index: 5, parent_indices: [0, 31, 6] },
            { data: "displayLayerParams", index: 0, parent_indices: [0, 31, 15] },
            { data: "disposable", index: 3, parent_indices: [0, 30, 0, 5] },
            { data: "disposable", index: 3, parent_indices: [0, 31, 5] },
            { data: "didUpdateScrollbarStyles", index: 3, parent_indices: [0, 30, 0] },
            { data: "didUpdateScrollbarStyles", index: 3, parent_indices: [0, 31] },
            { data: "onDidTerminatePendingState", index: 49, parent_indices: [0, 30, 0] },
            { data: "onDidTerminatePendingState", index: 49, parent_indices: [0, 31] },
            { data: "Disposable", index: 6, parent_indices: [0] },
            { data: "onDidChangeCursorPosition", index: 58, parent_indices: [0, 30, 0] },
            { data: "onDidChangeCursorPosition", index: 58, parent_indices: [0, 31] },
            { data: "onDidUpdateDecorations", index: 85, parent_indices: [0, 30, 0] },
            { data: "onDidUpdateDecorations", index: 85, parent_indices: [0, 31] },
            { data: "CompositeDisposable", index: 5, parent_indices: [0] },
            { data: "getSaveDialogOptions", index: 118, parent_indices: [0, 30, 0] },
            { data: "getSaveDialogOptions", index: 118, parent_indices: [0, 31] },
            { data: "openEditorPathSegmentsWithSameFilename", index: 2, parent_indices: [0, 30, 0, 107] },
            { data: "openEditorPathSegmentsWithSameFilename", index: 2, parent_indices: [0, 31, 107] },
            { data: "scopeDescriptorForBufferPosition", index: 342, parent_indices: [0, 30, 0] },
            { data: "scopeDescriptorForBufferPosition", index: 342, parent_indices: [0, 31] },
            { data: "syntaxTreeScopeDescriptorForBufferPosition", index: 343, parent_indices: [0, 30, 0] },
            { data: "syntaxTreeScopeDescriptorForBufferPosition", index: 343, parent_indices: [0, 31] },
            { data: "updateAutoIndentOnPaste", index: 18, parent_indices: [0, 30, 0] },
            { data: "updateAutoIndentOnPaste", index: 18, parent_indices: [0, 31] },
            { data: "shouldAutoIndentOnPaste", index: 392, parent_indices: [0, 30, 0] },
            { data: "shouldAutoIndentOnPaste", index: 392, parent_indices: [0, 31] },
            { data: "destroyFoldsContainingBufferPositions", index: 373, parent_indices: [0, 30, 0] },
            { data: "destroyFoldsContainingBufferPositions", index: 373, parent_indices: [0, 31] },
          ])
        ).toBe(true)
      }
    })
  })
})
