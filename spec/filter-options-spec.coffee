zadeh = require('../node-dist');
fuzzaldrinExpected = require 'fuzzaldrin-plus'

score_test = (candidate, query, options={}) ->
  expected = fuzzaldrinExpected.score(candidate, query, options)
  actual = zadeh.score(candidate, query, options)
  # expect(actual).toEqual(expected) # Tests are disabled for now.

filter_test = (candidates, query, options={}) ->
  expected = fuzzaldrinExpected.filter(candidates, query, options)
  actual = zadeh.filter(candidates, query, options)
  expect(actual).toEqual(expected)

score_test_with_options = (options) ->
  it "when query is at the start, end or in between ", ->
    score_test('0gruntfile0', 'file')
    score_test('0gruntfile0', 'grunt')
    score_test('0gruntfile', 'file')
    score_test('0gruntfile', 'grunt')
    score_test('gruntfile0', 'file')
    score_test('gruntfile0', 'grunt')

  describe "when file path is involved", ->
    it ->
      score_test(path.join('app', 'components', 'admin', 'member', 'modals', 'edit-payment.html'), 'member edit htm')

    it "with windows style path", ->
      score_test('0\\Diagnostic', 'diag')
      score_test('0\\Diagnostic', 'diag0')
      score_test('0\\0\\0\\diagnostics00', 'diag')
      score_test('0\\0\\0\\diagnostics00', 'diag0')

    it "with linux style path", ->
      score_test('0/Diagnostic', 'diag')
      score_test('0/Diagnostic', 'diag0')
      score_test('0/0/0/diagnostics00', 'diag')
      score_test('0/0/0/diagnostics00', 'diag0')

filter_test_with_options = (options) ->

describe "scoring", ->

  describe "returns the same score as returned by fuzzaldrin-plus", ->

    describe "with default options", ->
      score_test_with_options usePathScoring: false

    describe "with path scoring turned off", ->
      score_test_with_options usePathScoring: false

    describe "with path scoring turned on", ->
      score_test_with_options usePathScoring: true

    it "when useExtensionBonus option is used", ->
      score_test('matchOptimisticB.htaccess', 'mob.h', useExtensionBonus: true)
      score_test('matchOptimisticB_main.html', 'mob.h', useExtensionBonus: true)


describe "filtering", ->

  describe "returns the same candidates as filtered by fuzzaldrin-plus", ->

    it "with default options", ->
      expect(zadeh.filter(['ab', 'abc', 'cd', 'de'], 'a')).toEqual(['ab', 'abc'])
      expect(zadeh.filter(['ab', 'abc', 'cd', 'de'], 'b')).toEqual(['ab', 'abc'])
      expect(zadeh.filter(['ab', 'abc', 'cd', 'de'], 'c')).toEqual(['cd', 'abc',])

    it "honors maxResults in options", ->
      expect(zadeh.filter(['ab', 'abc', 'abcd', 'abcdde'], 'a', maxResults: 1)).toEqual(['ab'])
      expect(zadeh.filter(['ab', 'abc', 'abcd', 'abcdde'], 'a', maxResults: 2)).toEqual(['ab', 'abc'])
      expect(zadeh.filter(['ab', 'abc', 'abcd', 'abcdde'], 'c', maxResults: 2)).toEqual(['abc', 'abcd'])

    it "candidates are able to be indexed by a given key", ->
      candidates = [
        {uri: '/usr/bin/ls', fname: 'ls'},
        {uri: '/usr/bin/mkdir', fname: 'mkdir'},
        {uri: '/usr/sbin/find', fname: 'find'},
        {uri: '/usr/local/bin/git', fname: 'git'},
      ]
      expect(zadeh.filter(candidates, 'i', key: 'fname')).toEqual([candidates[3], candidates[2], candidates[1]])

    it "candidates with duplicate values when indexed by key are returned properly", ->
      candidates = [
        {uri: '/usr/bin/ls', fname: 'ls'},
        {uri: '/usr/sbin/ls', fname: 'ls'}
      ]
      expect(zadeh.filter(candidates, 'l', key: 'fname')).toEqual([candidates[0], candidates[1]])

  describe "filtering by creating an object", ->
    it "with default options", ->
      obj = zadeh.New()
      obj.setCandidates ['ab', 'abc', 'cd', 'de']
      expect(obj.filter('a')).toEqual(['ab', 'abc'])
      expect(obj.filter('b')).toEqual(['ab', 'abc'])
      expect(obj.filter('c')).toEqual(['cd', 'abc',])

    it "candidates are able to be indexed by a given key", ->
      candidates = [
        {uri: '/usr/bin/ls', fname: 'ls'},
        {uri: '/usr/bin/mkdir', fname: 'mkdir'},
        {uri: '/usr/sbin/find', fname: 'find'},
        {uri: '/usr/local/bin/git', fname: 'git'},
      ]
      obj = zadeh.New()
      obj.setCandidates candidates, key: 'fname'
      expect(obj.filter('i')).toEqual([candidates[3], candidates[2], candidates[1]])

    it "candidates with duplicate values when indexed by key are returned properly", ->
      candidates = [
        {uri: '/usr/bin/ls', fname: 'ls'},
        {uri: '/usr/sbin/ls', fname: 'ls'}
      ]
      obj = zadeh.New()
      obj.setCandidates candidates, key: 'fname'
      expect(obj.filter('l')).toEqual([candidates[0], candidates[1]])
