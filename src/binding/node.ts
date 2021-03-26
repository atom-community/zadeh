import nodeGypBuld from "node-gyp-build"
const binding = nodeGypBuld(__dirname) // this relies on Parcel to bundle this file in the root of the package, so __dirname becomes correct

import type { IOptions, IFilterOptions } from "./node-types"

const defaultPathSeparator = process.platform === "win32" ? "\\" : "/"

function parseOptions(options: IOptions) {
  // options.allowErrors ? = false
  if (options.usePathScoring === undefined || options.usePathScoring === null) {
    options.usePathScoring = true
  }
  // options.useExtensionBonus ? = false
  if (!options.pathSeparator) {
    options.pathSeparator = defaultPathSeparator
  }
  return options
}

function parseFilterOptions<T>(filterOptions: IFilterOptions<T>) {
  // options.optCharRegEx ? = null
  // options.wrap ? = null
  if (!filterOptions.maxResults) {
    filterOptions.maxResults = 0
  }
  // parse common options
  return parseOptions(filterOptions)
}

function getDataKey<T>(dataKey: string | IFilterOptions<T>): string | undefined {
  if (typeof dataKey === "string") {
    return dataKey
  } else if (dataKey?.key) {
    // console.warn(`Zadeh: deprecated option.
    // Pass the key as a string to the second argument of 'ArrayFilterer.setCandidates'
    // or to the third argument of 'filter'`)
    // an object (options) containing the key
    // @ts-ignore
    return dataKey.key
  } else {
    return undefined
  }
}

/** ArrayFilterer is a class that allows to set the `candidates` only once and perform filtering on them multiple times.
 *  This is much more efficient than calling the `filter` function directly.
 */
export class ArrayFilterer<T> {
  obj = new binding.Zadeh()
  candidates: Array<T>

  /** The method to set the candidates that are going to be filtered
   * @param candidates An array of tree objects.
   * @param dataKey (optional) if `candidates` is an array of objects, pass the key in the object which holds the data.
   */
  setCandidates(candidates: Array<T>, dataKey?: string): void {
    this.candidates = candidates
    if (dataKey) {
      const validDataKey = getDataKey<T>(dataKey)
      candidates = candidates.map((item) => item[validDataKey as string])
    }
    return this.obj.setArrayFiltererCandidates(candidates)
  }

  /** The method to perform the filtering on the already set candidates
   *  @param query A string query to match each candidate against.
   *  @param options options
   *  @return returns an array of candidates sorted by best match against the query.
   */
  filter(query: string, options: IFilterOptions<T> = {}): Array<T> {
    options = parseFilterOptions(options)
    const res = this.obj.filter(
      query,
      options.maxResults,
      Boolean(options.usePathScoring),
      Boolean(options.useExtensionBonus)
    )
    return res.map((ind) => this.candidates[ind])
  }
}

/**
 * @deprecated use ArrayFilterer or TreeFilterer classes instead
 */
export const New = () => new ArrayFilterer()

/** Sort and filter the given candidates by matching them against the given query.
 * @param candidates An array of strings or objects.
 * @param query A string query to match each candidate against.
 * @param options options
 * @return returns an array of candidates sorted by best match against the query.
 */
export function filter<T>(candidates: T[], query: string, options: IFilterOptions<T> = {}): T[] {
  if (!candidates || !query) {
    return []
  }
  const arrayFilterer = new ArrayFilterer<T>()
  arrayFilterer.setCandidates(candidates, getDataKey(options))
  return arrayFilterer.filter(query, options)
}

// The object (an element of the array) returned from filtering trees. It has the address of the object in the tree using `index` and `level`.
interface TreeFilterResult {
  data: string
  index: number
  level: number
}

/** TreeFilterer is a class that allows to set the `candidates` only once and perform filtering on them multiple times.
 *  This is much more efficient than calling the `filterTree` function directly.
 */
export class TreeFilterer<T> {
  obj = new binding.Zadeh()
  candidates: Array<T>

  /** The method to set the candidates that are going to be filtered
   * @param candidates An array of tree objects.
   * @param dataKey the key of the object (and its children) which holds the data (defaults to `"data"`)
   * @param childrenKey the key of the object (and its children) which hold the children (defaults to `"children"`)
   */
  setCandidates(candidates: Array<T>, dataKey: string = "data", childrenKey: string = "children"): void {
    this.candidates = candidates
    return this.obj.setTreeFiltererCandidates(candidates, dataKey, childrenKey)
  }

  /** The method to perform the filtering on the already set candidates
   *  @param query A string query to match each candidate against.
   *  @param options options
   *  @return An array of candidate objects in form of `{data, index, level}` sorted by best match against the query. Each objects has the address of the object in the tree using `index` and `level`.
   */
  filter(query: string, options: IFilterOptions<object> = {}): TreeFilterResult[] {
    options = parseFilterOptions(options)
    return this.obj.filterTree(
      query,
      options.maxResults,
      Boolean(options.usePathScoring),
      Boolean(options.useExtensionBonus)
    )
  }
}

export function filterTree(candidatesTrees, query, dataKey = "data", childrenKey = "children", options = {}) {
  if (!candidatesTrees || !query) {
    return []
  }
  const treeFilterer = new TreeFilterer()
  treeFilterer.setCandidates(candidatesTrees, dataKey, childrenKey)
  return treeFilterer.filter(query, options)
}

export function score(candidate, query, options = {}) {
  if (!candidate || !query) {
    return 0
  }
  options = parseOptions(options)
  return binding.score(candidate, query, Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
}

/** Other functions */

export function match(string, query, options = {}) {
  if (!string || !query) {
    return []
  }
  if (string == query) {
    return Array.from(Array(string.length).keys())
  }
  options = parseOptions(options)
  return binding.match(string, query, options.pathSeparator)
}

export function wrap(string, query, options = {}) {
  if (!string || !query) {
    return []
  }
  options = parseOptions(options)
  return binding.wrap(string, query, options.pathSeparator)
}

export function prepareQuery(query, options = {}) {
  // This is no - op since there is no major benefit by precomputing something
  // just for the query.
  return {}
}
