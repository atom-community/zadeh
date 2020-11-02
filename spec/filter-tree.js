const {filterTree} = require('../fuzzaldrin-dist')

candidates = [
  {data: "helloworld", children: []},
]
console.log(filterTree(candidates, "hello", "data", "children"))
