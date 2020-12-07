const { TreeFilterer } = require("../fuzzaldrin-dist")
const DeepEqual = require("deep-equal")
const fs = require("fs")
const path = require("path")

describe("TreeFilterer", function () {
  const outlineData = JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), "benchmark", "tree.json"), "utf8"))

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

  if (process.platform === "win32") {
    // answers are os dependant because of slight differences
    it("can search in outline data", () => {
      const treeFilterer = new TreeFilterer()
      treeFilterer.setCandidates(outlineData, "plainText", "children")

      expect(
        DeepEqual(treeFilterer.filter("text"), [
          { data: "text", index: 0, level: 4 },
          { data: "text", index: 0, level: 5 },
          { data: "text", index: 2, level: 4 },
          { data: "text", index: 0, level: 4 },
          { data: "text", index: 2, level: 5 },
          { data: "text", index: 0, level: 5 },
          { data: "textEditor", index: 3, level: 3 },
          { data: "textEditor", index: 3, level: 4 },
          { data: "textToDuplicate", index: 10, level: 4 },
          { data: "textToDuplicate", index: 10, level: 5 },
          { data: "setText", index: 146, level: 2 },
          { data: "getText", index: 119, level: 2 },
          { data: "setText", index: 146, level: 3 },
          { data: "getText", index: 119, level: 3 },
          { data: "lineText", index: 3, level: 4 },
          { data: "lineText", index: 3, level: 3 },
          { data: "TextEditor", index: 31, level: 1 },
          { data: "TextEditor", index: 0, level: 2 },
          { data: "TextBuffer", index: 8, level: 1 },
          { data: "pasteText", index: 353, level: 2 },
          { data: "pasteText", index: 353, level: 3 },
          { data: "insertText", index: 148, level: 3 },
          { data: "getTabText", index: 323, level: 2 },
          { data: "getTabText", index: 323, level: 3 },
          { data: "insertText", index: 148, level: 2 },
          { data: "lineTextIndex", index: 1, level: 3 },
          { data: "lineTextIndex", index: 1, level: 4 },
          { data: "getTextInRange", index: 141, level: 2 },
          { data: "getTextInRange", index: 141, level: 3 },
          { data: "clipboardText", index: 0, level: 3 },
          { data: "clipboardText", index: 0, level: 4 },
          { data: "TextEditorElement", index: 20, level: 1 },
          { data: "TextEditorComponent", index: 19, level: 1 },
          { data: "cutSelectedText", index: 352, level: 2 },
          { data: "onDidInsertText", index: 67, level: 2 },
          { data: "onDidInsertText", index: 67, level: 3 },
          { data: "cutSelectedText", index: 352, level: 3 },
          { data: "getSelectedText", index: 252, level: 3 },
          { data: "getSelectedText", index: 252, level: 2 },
          { data: "TextMateLanguageMode", index: 15, level: 1 },
          { data: "onWillInsertText", index: 66, level: 3 },
          { data: "onWillInsertText", index: 66, level: 2 },
          { data: "copySelectedText", index: 350, level: 2 },
          { data: "copySelectedText", index: 350, level: 3 },
          { data: "TextMateScopeSelector", index: 17, level: 1 },
          { data: "setTextInBufferRange", index: 147, level: 2 },
          { data: "getTextInBufferRange", index: 120, level: 3 },
          { data: "getTextInBufferRange", index: 120, level: 2 },
          { data: "setTextInBufferRange", index: 147, level: 3 },
          { data: "lineTextForScreenRow", index: 127, level: 3 },
          { data: "lineTextForBufferRow", index: 126, level: 2 },
          { data: "lineTextForScreenRow", index: 127, level: 2 },
          { data: "lineTextForBufferRow", index: 126, level: 3 },
          { data: "setPlaceholderText", index: 403, level: 2 },
          { data: "mutateSelectedText", index: 152, level: 2 },
          { data: "getPlaceholderText", index: 402, level: 2 },
          { data: "mutateSelectedText", index: 152, level: 3 },
          { data: "setPlaceholderText", index: 403, level: 3 },
          { data: "getPlaceholderText", index: 402, level: 3 },
          { data: "replaceSelectedText", index: 158, level: 2 },
          { data: "replaceSelectedText", index: 158, level: 3 },
          { data: "copyOnlySelectedText", index: 351, level: 2 },
          { data: "copyOnlySelectedText", index: 351, level: 3 },
          { data: "updatePlaceholderText", index: 33, level: 2 },
          { data: "updatePlaceholderText", index: 33, level: 3 },
          { data: "charTextToLeftOfSelection", index: 2, level: 4 },
          { data: "charTextToLeftOfSelection", index: 2, level: 5 },
          { data: "emitWillInsertTextEvent", index: 450, level: 2 },
          { data: "emitWillInsertTextEvent", index: 450, level: 3 },
          { data: "charTextToRightOfSelection", index: 2, level: 4 },
          { data: "charTextToRightOfSelection", index: 2, level: 5 },
          { data: "onDidChangePlaceholderText", index: 80, level: 2 },
          { data: "onDidChangePlaceholderText", index: 80, level: 3 },
          { data: "deleteToNextWordBoundary", index: 169, level: 3 },
          { data: "deleteToNextWordBoundary", index: 169, level: 2 },
          { data: "moveToNextWordBoundary", index: 238, level: 3 },
          { data: "moveToNextWordBoundary", index: 238, level: 2 },
          { data: "moveToNextSubwordBoundary", index: 240, level: 3 },
          { data: "moveToNextSubwordBoundary", index: 240, level: 2 },
          { data: "selectToNextWordBoundary", index: 282, level: 3 },
          { data: "selectToNextWordBoundary", index: 282, level: 2 },
          { data: "selectToNextSubwordBoundary", index: 278, level: 3 },
          { data: "selectToNextSubwordBoundary", index: 278, level: 2 },
          { data: "moveToBeginningOfNextWord", index: 236, level: 3 },
          { data: "moveToBeginningOfNextWord", index: 236, level: 2 },
          { data: "selectToBeginningOfNextWord", index: 283, level: 3 },
          { data: "selectToBeginningOfNextWord", index: 283, level: 2 },
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

      expect(
        DeepEqual(treeFilterer.filter("disp"), [
          { data: "disposable", index: 3, level: 4 },
          { data: "disposable", index: 3, level: 3 },
          { data: "displayLayer", index: 0, level: 4 },
          { data: "displayLayer", index: 0, level: 3 },
          { data: "displayBuffer", index: 9, level: 3 },
          { data: "displayBuffer", index: 9, level: 2 },
          { data: "displayLayerParams", index: 0, level: 4 },
          { data: "displayLayerParams", index: 5, level: 3 },
          { data: "displayLayerParams", index: 0, level: 3 },
          { data: "displayLayerParams", index: 5, level: 4 },
          { data: "Disposable", index: 6, level: 1 },
          { data: "CompositeDisposable", index: 5, level: 1 },
          { data: "subscribeToDisplayLayer", index: 50, level: 3 },
          { data: "subscribeToDisplayLayer", index: 50, level: 2 },
          { data: "onDidStopChanging", index: 57, level: 3 },
          { data: "onDidStopChanging", index: 57, level: 2 },
          { data: "onDidChangeScrollTop", index: 81, level: 2 },
          { data: "onDidChangeScrollTop", index: 81, level: 3 },
          { data: "onDidChangeSoftWrapped", index: 60, level: 2 },
          { data: "onDidChangeSoftWrapped", index: 60, level: 3 },
          { data: "onDidChangeCursorPosition", index: 58, level: 3 },
          { data: "onDidChangeCursorPosition", index: 58, level: 2 },
        ])
      ).toBe(true)

      expect(
        DeepEqual(treeFilterer.filter("dips"), [
          { data: "didUpdateStyles", index: 2, level: 3 },
          { data: "didUpdateStyles", index: 2, level: 2 },
          { data: "displayLayerParams", index: 5, level: 3 },
          { data: "displayLayerParams", index: 0, level: 3 },
          { data: "displayLayerParams", index: 5, level: 4 },
          { data: "displayLayerParams", index: 0, level: 4 },
          { data: "disposable", index: 3, level: 4 },
          { data: "disposable", index: 3, level: 3 },
          { data: "didUpdateScrollbarStyles", index: 3, level: 2 },
          { data: "didUpdateScrollbarStyles", index: 3, level: 3 },
          { data: "onDidTerminatePendingState", index: 49, level: 2 },
          { data: "onDidTerminatePendingState", index: 49, level: 3 },
          { data: "Disposable", index: 6, level: 1 },
          { data: "onDidChangeCursorPosition", index: 58, level: 2 },
          { data: "onDidChangeCursorPosition", index: 58, level: 3 },
          { data: "onDidUpdateDecorations", index: 85, level: 2 },
          { data: "onDidUpdateDecorations", index: 85, level: 3 },
          { data: "CompositeDisposable", index: 5, level: 1 },
          { data: "getSaveDialogOptions", index: 118, level: 3 },
          { data: "getSaveDialogOptions", index: 118, level: 2 },
          {
            data: "openEditorPathSegmentsWithSameFilename",
            index: 2,
            level: 4,
          },
          {
            data: "openEditorPathSegmentsWithSameFilename",
            index: 2,
            level: 3,
          },
          { data: "scopeDescriptorForBufferPosition", index: 342, level: 3 },
          { data: "scopeDescriptorForBufferPosition", index: 342, level: 2 },
          {
            data: "syntaxTreeScopeDescriptorForBufferPosition",
            index: 343,
            level: 3,
          },
          {
            data: "syntaxTreeScopeDescriptorForBufferPosition",
            index: 343,
            level: 2,
          },
          { data: "updateAutoIndentOnPaste", index: 18, level: 2 },
          { data: "updateAutoIndentOnPaste", index: 18, level: 3 },
          { data: "shouldAutoIndentOnPaste", index: 392, level: 3 },
          { data: "shouldAutoIndentOnPaste", index: 392, level: 2 },
          {
            data: "destroyFoldsContainingBufferPositions",
            index: 373,
            level: 3,
          },
          {
            data: "destroyFoldsContainingBufferPositions",
            index: 373,
            level: 2,
          },
        ])
      ).toBe(true)
    })
  }
})
