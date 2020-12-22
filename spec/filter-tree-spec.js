const { filterTree } = require("../node-dist")
const DeepEqual = require("deep-equal")
const fs = require("fs")
const path = require("path")

describe("filterTree", () => {
  const outlineData = JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), "benchmark", "tree.json"), "utf8"))

  it("can fuzzy search in an array tree objects", () => {
    const candidates = [
      { data: "bye1", children: [{ data: "hello" }] },
      { data: "Bye2", children: [{ data: "_bye4" }, { data: "hel" }] },
      { data: "eye" },
    ]

    expect(
      DeepEqual(filterTree(candidates, "hello", "data", "children"), [{ data: "hello", index: 0, level: 1 }])
    ).toBe(true)

    expect(
      DeepEqual(filterTree(candidates, "hel", "data", "children"), [
        { data: "hel", index: 1, level: 1 },
        { data: "hello", index: 0, level: 1 },
      ])
    ).toBe(true)

    expect(
      DeepEqual(filterTree(candidates, "he", "data", "children"), [
        { data: "hel", index: 1, level: 1 },
        { data: "hello", index: 0, level: 1 },
      ])
    ).toBe(true)

    expect(
      DeepEqual(filterTree(candidates, "bye", "data", "children"), [
        { data: "bye1", index: 0, level: 0 },
        { data: "_bye4", index: 0, level: 1 },
        { data: "Bye2", index: 1, level: 0 },
      ])
    ).toBe(true)

    // console.log(filterTree(candidates, "ye", "data", "children"))
    expect(
      DeepEqual(filterTree(candidates, "ye", "data", "children"), [
        { data: "eye", index: 2, level: 0 },
        { data: "bye1", index: 0, level: 0 },
        { data: "Bye2", index: 1, level: 0 },
        { data: "_bye4", index: 0, level: 1 },
      ])
    ).toBe(true)

    // test maxResults
    // console.log(filterTree(candidates, "bye", "data", "children", { maxResults: 2 }))
    expect(
      DeepEqual(filterTree(candidates, "bye", "data", "children", { maxResults: 2 }), [
        { data: "bye1", index: 0, level: 0 },
        { data: "Bye2", index: 1, level: 0 },
      ])
    ).toBe(true)

    // console.log(filterTree(candidates, "ye", "data", "children", { maxResults: 3 }))
    expect(
      DeepEqual(filterTree(candidates, "ye", "data", "children", { maxResults: 3 }), [
        { data: "bye1", index: 0, level: 0 },
        { data: "Bye2", index: 1, level: 0 },
        { data: "_bye4", index: 0, level: 1 },
      ])
    ).toBe(true)
  })

  it("can search in an array of children-less objects", () => {
    const candidates = [{ data: "helloworld" }, { data: "bye" }, { data: "hello" }]
    expect(
      DeepEqual(filterTree(candidates, "hello", "data", "children"), [
        { data: "hello", index: 2, level: 0 },
        { data: "helloworld", index: 0, level: 0 },
      ])
    ).toBe(true)

    // test default values
    expect(
      DeepEqual(filterTree(candidates, "hello"), [
        { data: "hello", index: 2, level: 0 },
        { data: "helloworld", index: 0, level: 0 },
      ])
    ).toBe(true)
  })

  // answers are os dependant because of slight differences
  // console.log(filterTree(outlineData, "text", "plainText", "children"))
  it("can search in outline data", () => {
    process.platform === "win32" &&
      expect(
        DeepEqual(filterTree(outlineData, "text", "plainText", "children"), [
          { data: "text", index: 0, level: 4 },
          { data: "text", index: 0, level: 4 },
          { data: "text", index: 0, level: 5 },
          { data: "text", index: 0, level: 5 },
          { data: "text", index: 2, level: 4 },
          { data: "text", index: 2, level: 5 },
          { data: "textEditor", index: 3, level: 3 },
          { data: "textEditor", index: 3, level: 4 },
          { data: "textToDuplicate", index: 10, level: 5 },
          { data: "textToDuplicate", index: 10, level: 4 },
          { data: "getText", index: 119, level: 2 },
          { data: "setText", index: 146, level: 2 },
          { data: "setText", index: 146, level: 3 },
          { data: "getText", index: 119, level: 3 },
          { data: "lineText", index: 3, level: 3 },
          { data: "lineText", index: 3, level: 4 },
          { data: "TextEditor", index: 0, level: 2 },
          { data: "TextBuffer", index: 8, level: 1 },
          { data: "TextEditor", index: 31, level: 1 },
          { data: "pasteText", index: 353, level: 3 },
          { data: "pasteText", index: 353, level: 2 },
          { data: "insertText", index: 148, level: 3 },
          { data: "insertText", index: 148, level: 2 },
          { data: "getTabText", index: 323, level: 3 },
          { data: "getTabText", index: 323, level: 2 },
          { data: "lineTextIndex", index: 1, level: 3 },
          { data: "lineTextIndex", index: 1, level: 4 },
          { data: "getTextInRange", index: 141, level: 2 },
          { data: "getTextInRange", index: 141, level: 3 },
          { data: "clipboardText", index: 0, level: 4 },
          { data: "clipboardText", index: 0, level: 3 },
          { data: "TextEditorElement", index: 20, level: 1 },
          { data: "TextEditorComponent", index: 19, level: 1 },
          { data: "onDidInsertText", index: 67, level: 2 },
          { data: "onDidInsertText", index: 67, level: 3 },
          { data: "getSelectedText", index: 252, level: 2 },
          { data: "cutSelectedText", index: 352, level: 2 },
          { data: "cutSelectedText", index: 352, level: 3 },
          { data: "getSelectedText", index: 252, level: 3 },
          { data: "TextMateLanguageMode", index: 15, level: 1 },
          { data: "onWillInsertText", index: 66, level: 2 },
          { data: "onWillInsertText", index: 66, level: 3 },
          { data: "copySelectedText", index: 350, level: 2 },
          { data: "copySelectedText", index: 350, level: 3 },
          { data: "TextMateScopeSelector", index: 17, level: 1 },
          { data: "getTextInBufferRange", index: 120, level: 3 },
          { data: "setTextInBufferRange", index: 147, level: 2 },
          { data: "setTextInBufferRange", index: 147, level: 3 },
          { data: "getTextInBufferRange", index: 120, level: 2 },
          { data: "lineTextForBufferRow", index: 126, level: 3 },
          { data: "lineTextForScreenRow", index: 127, level: 2 },
          { data: "lineTextForBufferRow", index: 126, level: 2 },
          { data: "lineTextForScreenRow", index: 127, level: 3 },
          { data: "mutateSelectedText", index: 152, level: 2 },
          { data: "mutateSelectedText", index: 152, level: 3 },
          { data: "getPlaceholderText", index: 402, level: 3 },
          { data: "setPlaceholderText", index: 403, level: 3 },
          { data: "getPlaceholderText", index: 402, level: 2 },
          { data: "setPlaceholderText", index: 403, level: 2 },
          { data: "replaceSelectedText", index: 158, level: 3 },
          { data: "replaceSelectedText", index: 158, level: 2 },
          { data: "copyOnlySelectedText", index: 351, level: 2 },
          { data: "copyOnlySelectedText", index: 351, level: 3 },
          { data: "updatePlaceholderText", index: 33, level: 3 },
          { data: "updatePlaceholderText", index: 33, level: 2 },
          { data: "charTextToLeftOfSelection", index: 2, level: 5 },
          { data: "charTextToLeftOfSelection", index: 2, level: 4 },
          { data: "emitWillInsertTextEvent", index: 450, level: 3 },
          { data: "emitWillInsertTextEvent", index: 450, level: 2 },
          { data: "charTextToRightOfSelection", index: 2, level: 5 },
          { data: "charTextToRightOfSelection", index: 2, level: 4 },
          { data: "onDidChangePlaceholderText", index: 80, level: 3 },
          { data: "onDidChangePlaceholderText", index: 80, level: 2 },
          { data: "deleteToNextWordBoundary", index: 169, level: 3 },
          { data: "deleteToNextWordBoundary", index: 169, level: 2 },
          { data: "moveToNextWordBoundary", index: 238, level: 3 },
          { data: "moveToNextWordBoundary", index: 238, level: 2 },
          { data: "moveToNextSubwordBoundary", index: 240, level: 2 },
          { data: "moveToNextSubwordBoundary", index: 240, level: 3 },
          { data: "selectToNextWordBoundary", index: 282, level: 2 },
          { data: "selectToNextWordBoundary", index: 282, level: 3 },
          { data: "selectToNextSubwordBoundary", index: 278, level: 2 },
          { data: "selectToNextSubwordBoundary", index: 278, level: 3 },
          { data: "moveToBeginningOfNextWord", index: 236, level: 3 },
          { data: "moveToBeginningOfNextWord", index: 236, level: 2 },
          { data: "selectToBeginningOfNextWord", index: 283, level: 2 },
          { data: "selectToBeginningOfNextWord", index: 283, level: 3 },
          { data: "moveToBeginningOfNextParagraph", index: 241, level: 3 },
          { data: "moveToBeginningOfNextParagraph", index: 241, level: 2 },
          { data: "selectToBeginningOfNextParagraph", index: 284, level: 3 },
          { data: "selectToBeginningOfNextParagraph", index: 284, level: 2 },
          { data: "firstExistingFoldRange", index: 4, level: 4 },
          { data: "firstExistingFoldRange", index: 4, level: 3 },
          { data: "updateMaxScreenLineLength", index: 29, level: 3 },
          { data: "updateMaxScreenLineLength", index: 29, level: 2 },
        ])
      ).toBe(true)

    // console.log(filterTree(outlineData, "disp", "plainText", "children"))
    process.platform !== "linux" &&
      expect(
        DeepEqual(filterTree(outlineData, "disp", "plainText", "children"), [
          { data: "disposable", index: 3, level: 4 },
          { data: "disposable", index: 3, level: 3 },
          { data: "displayLayer", index: 0, level: 4 },
          { data: "displayLayer", index: 0, level: 3 },
          { data: "displayBuffer", index: 9, level: 3 },
          { data: "displayBuffer", index: 9, level: 2 },
          { data: "displayLayerParams", index: 5, level: 4 },
          { data: "displayLayerParams", index: 0, level: 4 },
          { data: "displayLayerParams", index: 5, level: 3 },
          { data: "displayLayerParams", index: 0, level: 3 },
          { data: "Disposable", index: 6, level: 1 },
          { data: "CompositeDisposable", index: 5, level: 1 },
          { data: "subscribeToDisplayLayer", index: 50, level: 3 },
          { data: "subscribeToDisplayLayer", index: 50, level: 2 },
          { data: "onDidStopChanging", index: 57, level: 3 },
          { data: "onDidStopChanging", index: 57, level: 2 },
          { data: "onDidChangeScrollTop", index: 81, level: 3 },
          { data: "onDidChangeScrollTop", index: 81, level: 2 },
          { data: "onDidChangeSoftWrapped", index: 60, level: 3 },
          { data: "onDidChangeSoftWrapped", index: 60, level: 2 },
          { data: "onDidChangeCursorPosition", index: 58, level: 3 },
          { data: "onDidChangeCursorPosition", index: 58, level: 2 },
        ])
      ).toBe(true)

    // console.log(filterTree(outlineData, "dips", "plainText", "children"))
    process.platform !== "linux" &&
      expect(
        DeepEqual(filterTree(outlineData, "dips", "plainText", "children"), [
          { data: "didUpdateStyles", index: 2, level: 3 },
          { data: "didUpdateStyles", index: 2, level: 2 },
          { data: "displayLayerParams", index: 5, level: 4 },
          { data: "displayLayerParams", index: 0, level: 4 },
          { data: "displayLayerParams", index: 5, level: 3 },
          { data: "displayLayerParams", index: 0, level: 3 },
          { data: "disposable", index: 3, level: 4 },
          { data: "disposable", index: 3, level: 3 },
          { data: "didUpdateScrollbarStyles", index: 3, level: 3 },
          { data: "didUpdateScrollbarStyles", index: 3, level: 2 },
          { data: "onDidTerminatePendingState", index: 49, level: 3 },
          { data: "onDidTerminatePendingState", index: 49, level: 2 },
          { data: "Disposable", index: 6, level: 1 },
          { data: "onDidChangeCursorPosition", index: 58, level: 3 },
          { data: "onDidChangeCursorPosition", index: 58, level: 2 },
          { data: "onDidUpdateDecorations", index: 85, level: 3 },
          { data: "onDidUpdateDecorations", index: 85, level: 2 },
          { data: "CompositeDisposable", index: 5, level: 1 },
          { data: "getSaveDialogOptions", index: 118, level: 3 },
          { data: "getSaveDialogOptions", index: 118, level: 2 },
          { data: "openEditorPathSegmentsWithSameFilename", index: 2, level: 4 },
          { data: "openEditorPathSegmentsWithSameFilename", index: 2, level: 3 },
          { data: "scopeDescriptorForBufferPosition", index: 342, level: 3 },
          { data: "scopeDescriptorForBufferPosition", index: 342, level: 2 },
          { data: "syntaxTreeScopeDescriptorForBufferPosition", index: 343, level: 3 },
          { data: "syntaxTreeScopeDescriptorForBufferPosition", index: 343, level: 2 },
          { data: "updateAutoIndentOnPaste", index: 18, level: 3 },
          { data: "updateAutoIndentOnPaste", index: 18, level: 2 },
          { data: "shouldAutoIndentOnPaste", index: 392, level: 3 },
          { data: "shouldAutoIndentOnPaste", index: 392, level: 2 },
          { data: "destroyFoldsContainingBufferPositions", index: 373, level: 3 },
          { data: "destroyFoldsContainingBufferPositions", index: 373, level: 2 },
        ])
      ).toBe(true)
  })
})
