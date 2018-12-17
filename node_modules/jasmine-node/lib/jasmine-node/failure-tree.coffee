path = require 'path'

_ = require 'underscore'
coffeestack = require 'coffeestack'

sourceMaps = {}

module.exports =
class FailureTree
  suites: null

  constructor: ->
    @suites = []

  isEmpty: -> @suites.length is 0

  add: (spec) ->
    for item in spec.results().items_ when item.passed_ is false
      failurePath = []
      parent = spec.suite
      while parent
        failurePath.unshift(parent)
        parent = parent.parentSuite

      parentSuite = this
      for failure in failurePath
        parentSuite.suites[failure.id] ?= {spec: failure, suites: [], specs: []}
        parentSuite = parentSuite.suites[failure.id]

      parentSuite.specs[spec.id] ?= {spec, failures:[]}
      parentSuite.specs[spec.id].failures.push(item)
      @filterStackTrace(item)

  filterJasmineLines: (stackTraceLines) ->
    jasminePattern = /^\s*at\s+.*\(?.*[\\/]jasmine(-[^\\/]*)?\.js:\d+:\d+\)?\s*$/

    index = 0
    while index < stackTraceLines.length
      if jasminePattern.test(stackTraceLines[index])
        stackTraceLines.splice(index, 1)
      else
        index++

  filterTrailingTimersLine: (stackTraceLines) ->
    if (/^(\s*at .* )\(timers\.js:\d+:\d+\)/.test(_.last(stackTraceLines)))
      stackTraceLines.pop()

  filterSetupLines: (stackTraceLines) ->
    # Ignore all lines starting at the first call to Object.jasmine.executeSpecsInFolder()
    removeLine = false
    index = 0
    while index < stackTraceLines.length
      removeLine or= /^\s*at Object\.jasmine\.executeSpecsInFolder/.test(stackTraceLines[index])
      if removeLine
        stackTraceLines.splice(index, 1)
      else
        index++

  filterFailureMessageLine: (failure, stackTraceLines) ->
    # Remove initial line(s) when they match the failure message
    errorLines = []
    while stackTraceLines.length > 0
      if /^\s+at\s+.*\((.*):(\d+):(\d+)\)\s*$/.test(stackTraceLines[0])
        break
      else
        errorLines.push(stackTraceLines.shift())

    stackTraceErrorMessage = errorLines.join('\n')
    {message} = failure
    if stackTraceErrorMessage isnt message and stackTraceErrorMessage isnt "Error: #{message}"
      stackTraceLines.splice(0, 0, errorLines...)

  filterOriginLine: (failure, stackTraceLines) ->
    return stackTraceLines unless stackTraceLines.length is 1

    # Remove remaining line if it is from an anonymous function
    if match = /^\s*at\s+((\[object Object\])|(null))\.<anonymous>\s+\((.*):(\d+):(\d+)\)\s*$/.exec(stackTraceLines[0])
      stackTraceLines.shift()
      filePath = path.relative(process.cwd(), match[4])
      line = match[5]
      column = match[6]
      failure.messageLine = "#{filePath}:#{line}:#{column}"

  filterStackTrace: (failure) ->
    stackTrace = failure.trace.stack
    return unless stackTrace

    stackTraceLines = stackTrace.split('\n').filter (line) -> line
    @filterJasmineLines(stackTraceLines)
    @filterTrailingTimersLine(stackTraceLines)
    @filterSetupLines(stackTraceLines)
    stackTrace = coffeestack.convertStackTrace(stackTraceLines.join('\n'), sourceMaps)
    return unless stackTrace

    stackTraceLines = stackTrace.split('\n').filter (line) -> line
    @filterFailureMessageLine(failure, stackTraceLines)
    @filterOriginLine(failure, stackTraceLines)
    failure.filteredStackTrace = stackTraceLines.join('\n')

  forEachSpec: ({spec, suites, specs, failures}={}, callback, depth=0) ->
    if failures?
      callback(spec, null, depth)
      callback(spec, failure, depth) for failure in failures
    else
      callback(spec, null, depth)
      depth++
      @forEachSpec(child, callback, depth) for child in _.compact(suites)
      @forEachSpec(child, callback, depth) for child in _.compact(specs)

  forEach: (callback) ->
    @forEachSpec(suite, callback) for suite in _.compact(@suites)
