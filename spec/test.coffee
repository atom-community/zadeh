fuzzaldrinplusfast = require('../fuzzaldrin');
fuzzaldrinExpected = require 'fuzzaldrin-plus'
path = require 'path'
fs = require 'fs'

defaultPathSeparator = if process?.platform is "win32" then '\\' else '/'

testPathScorer = ->
  tests = [
    ["0gruntfile0", "file"],
    ["gruntfile0", "file"],
    ["0gruntfile", "file"],
    ["0gruntfile0", "grunt"],
    ["gruntfile0", "grunt"],
    ["0gruntfile", "grunt"],
    [path.join('app', 'components', 'admin', 'member', 'modals', 'edit-payment.html'), 'member edit htm'],
    [path.join('matchOptimisticB.htaccess'), 'mob.h', useExtensionBonus: true],
    [path.join('matchOptimisticB_main.html'), 'mob.h', useExtensionBonus: true],
  ]
  for test in tests
    test[2] ?= {}
    actual = fuzzaldrinplusfast.score(test[0], test[1], test[2])
    expected = fuzzaldrinExpected.score(test[0], test[1], test[2])
    if expected != actual
      console.log 'TEST FAIL', expected, actual
      console.log '==========================================================================================================='

# https://stackoverflow.com/questions/11142666/is-there-an-idiomatic-way-to-test-array-equality-in-coffeescript
arrayEqual = (a, b) ->
  a.length is b.length and a.every (elem, i) -> elem is b[i]

testFilter = ->
  tests = [
    {
      candidates: ['0gruntfile0', 'gruntfile0', '0gruntfile'],
      queries: ['file', 'grunt']
    },
    {
      candidates: [
        'controller x',
        '0_co_re_00 x',
        '0core0_000 x',
        '0core_0000 x',
        '0_core0_00 x',
        '0_core_000 x'
      ],
      queries: ['core', 'core x']
    },
    {
      candidates: [
        path.join('model', 'controller.x'),
        path.join('0', 'model', '0core0_0.x'),
        path.join('0', '0', 'model', '0core_00.x'),
        path.join('0', '0', '0', 'model', 'core0_00.x'),
        path.join('0', '0', '0', '0', 'model', 'core_000.x')
      ],
      queries: ['model core', 'model core x']
    },
    {
      candidates: [
        path.join('app', 'components', 'admin', 'member', 'modals', 'edit-payment.html'),
        path.join('app', 'components', 'admin', 'member', 'edit', 'edit.html'),
        path.join('app', 'components', 'admin', 'member', 'modals', 'edit-paykent.html'),
      ],
      queries: ['member edit htm', 'member edit html', 'edit htm', 'edit html']
    },
    {
      candidates: [
        path.join('matchOptimisticB.htaccess')
        path.join('matchOptimisticB_main.html')
      ],
      queries: ['mob.h', 'mob.ht'],
      options: useExtensionBonus: true
    }
  ]
  for test in tests
    for query in test.queries
      expected = fuzzaldrinExpected.filter test.candidates, query
      obj = fuzzaldrinplusfast.New()
      obj.setCandidates(test.candidates)
      actual = obj.filter(query, test.options?)
      if not arrayEqual expected, actual
        console.log 'TEST FAIL'
        console.log test.candidates
        console.log expected, actual
        console.log arrayEqual expected, actual
        console.log '==========================================================================================================='

testBenchmark = ->
  obj = new fuzzaldrinplusfast.New()
  filenames = fs.readFileSync('./benchmark/data-large.txt', 'utf-8').split('\n')
  obj.setCandidates filenames
  console.time('fuzzaldrinplusfast')
  obj.filter 'da', maxResults: 10
  console.timeEnd('fuzzaldrinplusfast')
  console.time('legacy')
  fuzzaldrinExpected.filter filenames, 'da', maxResults: 10
  console.timeEnd('legacy')

# testPathScorer()
# testFilter()
testBenchmark()
