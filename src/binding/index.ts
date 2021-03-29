// @ts-ignore
import nodeGypBuld from "node-gyp-build"

import * as Binding from "./binding"
const binding = nodeGypBuld(__dirname) as typeof Binding // __dirname relies on Parcel to bundle this file in the root of the package, so __dirname becomes correct

/*
 ██████  ██████  ████████ ██  ██████  ███    ██ ███████
██    ██ ██   ██    ██    ██ ██    ██ ████   ██ ██
██    ██ ██████     ██    ██ ██    ██ ██ ██  ██ ███████
██    ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
 ██████  ██         ██    ██  ██████  ██   ████ ███████
*/

export interface IOptions {
  /** @default false */
  allowErrors?: boolean

  /** @default true */
  usePathScoring?: boolean

  /** @default false */
  useExtensionBonus?: boolean

  pathSeparator?: "/" | "\\" | string

  // TODO not implemented?
  // optCharRegEx?: RegExp

  // TODO not implemented?
  // wrap?: { tagOpen?: string; tagClass?: string; tagClose?: string }

  /** @deprecated: there is no major benefit by precomputing something just for the query. */
  preparedQuery?: {}
}

export type IFilterOptions<T extends StringOrObjectArray> = IOptions & {
  /** @deprecated The key to use when candidates is an object
   * Deprecated option. Pass the key as a string to the second argument of 'ArrayFilterer.setCandidates' or to the third argument of 'filter'
   */
  key?: T extends string ? never : keyof T

  /** The maximum numbers of results to return */
  maxResults?: number

  // TODO not implemented
  // maxInners?: number
}

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
}

function parseFilterOptions<T extends StringOrObjectArray>(filterOptions: IFilterOptions<T>) {
  // options.optCharRegEx ? = null
  // options.wrap ? = null
  if (!filterOptions.maxResults) {
    filterOptions.maxResults = 0
  }
  // parse common options
  parseOptions(filterOptions)
}

function getDataKey<T extends StringOrObjectArray>(dataKey: string | IFilterOptions<T>): string | undefined {
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

/*
 █████  ██████  ██████   █████  ██    ██     ███████ ██ ██   ████████ ███████ ██████
██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██      ██ ██      ██    ██      ██   ██
███████ ██████  ██████  ███████   ████       █████   ██ ██      ██    █████   ██████
██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██ ██      ██    ██      ██   ██
██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██ ███████ ██    ███████ ██   ██
*/

export type ObjectElement = object & Record<string, string>
export type StringOrObjectArray = string | ObjectElement

/** ArrayFilterer is a class that allows to set the `candidates` only once and perform filtering on them multiple times.
 *  This is much more efficient than calling the `filter` function directly.
 */
export class ArrayFilterer<T extends StringOrObjectArray> {
  obj = new binding.Zadeh()
  // @ts-ignore
  candidates: Array<T>

  constructor(candidates?: Array<T>, dataKey?: string) {
    if (candidates) {
      this.setCandidates(candidates, dataKey)
    } else {
      this.candidates = []
    }
  }

  /** The method to set the candidates that are going to be filtered
   * @param candidates An array of tree objects.
   * @param dataKey (optional) if `candidates` is an array of objects, pass the key in the object which holds the data.
   */
  setCandidates(candidates: Array<T>, dataKey?: string) {
    this.candidates = candidates
    let candidateStrings: string[]
    if (dataKey) {
      const validDataKey = getDataKey<T>(dataKey)
      candidateStrings = (candidates as Array<Record<string, string>>).map((item) => item[validDataKey as string])
    } else {
      candidateStrings = candidates as string[]
    }
    return this.obj.setArrayFiltererCandidates(candidateStrings)
  }

  /** The method to perform the filtering on the already set candidates
   *  @param query A string query to match each candidate against.
   *  @param options options
   *  @return returns an array of candidates sorted by best match against the query.
   */
  filter(query: string, options: IFilterOptions<T> = {}): Array<T> {
    parseFilterOptions(options)
    const res = this.obj.filter(
      query,
      options.maxResults as number /* numberified by parseFilterOptions */,
      Boolean(options.usePathScoring),
      Boolean(options.useExtensionBonus)
    )
    return res.map((ind: number) => this.candidates[ind])
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
export function filter<T extends StringOrObjectArray>(
  candidates: T[],
  query: string,
  options: IFilterOptions<T> = {}
): T[] {
  if (!candidates || !query) {
    console.warn(`Zadeh: bad input to filter candidates: ${candidates}, query: ${query}`)
    return []
  }
  const arrayFilterer = new ArrayFilterer<T>()
  arrayFilterer.setCandidates(candidates, getDataKey(options))
  return arrayFilterer.filter(query, options)
}

/*
████████ ██████  ███████ ███████     ███████ ██ ██   ████████ ███████ ██████
   ██    ██   ██ ██      ██          ██      ██ ██      ██    ██      ██   ██
   ██    ██████  █████   █████       █████   ██ ██      ██    █████   ██████
   ██    ██   ██ ██      ██          ██      ██ ██      ██    ██      ██   ██
   ██    ██   ██ ███████ ███████     ██      ██ ███████ ██    ███████ ██   ██
*/

// The object (an element of the array) returned from filtering trees. It has the address of the object in the tree using `index` and `level`.
export interface TreeFilterResult {
  data: string
  index: number
  level: number
}

/** TreeFilterer is a class that allows to set the `candidates` only once and perform filtering on them multiple times.
 *  This is much more efficient than calling the `filterTree` function directly.
 */
export class TreeFilterer<T extends Tree = Tree> {
  obj = new binding.Zadeh()
  // @ts-ignore
  candidates: Array<T>

  constructor(candidates?: Array<T>, dataKey: string = "data", childrenKey: string = "children") {
    if (candidates) {
      this.setCandidates(candidates, dataKey, childrenKey)
    } else {
      this.candidates = []
    }
  }

  /** The method to set the candidates that are going to be filtered
   * @param candidates An array of tree objects.
   * @param dataKey the key of the object (and its children) which holds the data (defaults to `"data"`)
   * @param childrenKey the key of the object (and its children) which hold the children (defaults to `"children"`)
   */
  setCandidates(candidates: Array<T>, dataKey: string = "data", childrenKey: string = "children") {
    this.candidates = candidates
    return this.obj.setTreeFiltererCandidates(candidates, dataKey, childrenKey)
  }

  /** The method to perform the filtering on the already set candidates
   *  @param query A string query to match each candidate against.
   *  @param options options
   *  @return An array of candidate objects in form of `{data, index, level}` sorted by best match against the query. Each objects has the address of the object in the tree using `index` and `level`.
   */
  filter(query: string, options: IFilterOptions<ObjectElement> = {}): TreeFilterResult[] {
    parseFilterOptions(options)
    return this.obj.filterTree(
      query,
      options.maxResults as number /* numberified by parseFilterOptions */,
      Boolean(options.usePathScoring),
      Boolean(options.useExtensionBonus)
    )
  }
}

// TODO better type
export type Tree = Record<string, string>

/** Sort and filter the given Tree candidates by matching them against the given query.
 * A tree object is an object in which each entry stores the data in its dataKey and it has (may have) some children (with a similar structure) in its childrenKey
 * @param candidatesTrees An array of tree objects.
 * @param query A string query to match each candidate against.
 * @param dataKey the key of the object (and its children) which holds the data (defaults to `"data"`)
 * @param childrenKey the key of the object (and its children) which hold the children (defaults to `"children"`)
 * @param options options
 * @return An array of candidate objects in form of `{data, index, level}` sorted by best match against the query. Each objects has the address of the object in the tree using `index` and `level`.
 */
export function filterTree(
  candidatesTrees: Tree[],
  query: string,
  dataKey: string = "data",
  childrenKey: string = "children",
  options: IFilterOptions<Tree> = {}
): TreeFilterResult[] {
  if (!candidatesTrees || !query) {
    console.warn(`Zadeh: bad input to filterTree candidatesTrees: ${candidatesTrees}, query: ${query}`)
    return []
  }
  const treeFilterer = new TreeFilterer()
  treeFilterer.setCandidates(candidatesTrees, dataKey, childrenKey)
  return treeFilterer.filter(query, options)
}

/*
███████  ██████  ██████  ██████  ███████
██      ██      ██    ██ ██   ██ ██
███████ ██      ██    ██ ██████  █████
     ██ ██      ██    ██ ██   ██ ██
███████  ██████  ██████  ██   ██ ███████
*/

/** Score the given string against the given query.
 * @param candidate The string the score.
 * @param query The query to score the string against.
 * @param options options
 */
export function score(candidate: string, query: string, options: IOptions = {}): number {
  if (!candidate || !query) {
    console.warn(`Zadeh: bad input to score candidates: ${candidate}, query: ${query}`)
    return 0
  }
  parseOptions(options)
  return binding.score(candidate, query, Boolean(options.usePathScoring), Boolean(options.useExtensionBonus))
}

/*
███    ███  █████  ████████  ██████ ██   ██
████  ████ ██   ██    ██    ██      ██   ██
██ ████ ██ ███████    ██    ██      ███████
██  ██  ██ ██   ██    ██    ██      ██   ██
██      ██ ██   ██    ██     ██████ ██   ██
*/

/** Gives an array of indices at which the query matches the given string */
export function match(str: string, query: string, options: IOptions = {}): number[] {
  if (!str || !query) {
    console.warn(`Zadeh: bad input to match str: ${str}, query: ${query}`)
    return []
  }
  if (str === query) {
    return Array.from(Array(str.length).keys())
  }
  parseOptions(options)
  return binding.match(str, query, options.pathSeparator as string /* stringified by parseOption */)
}

/*
██     ██ ██████   █████  ██████
██     ██ ██   ██ ██   ██ ██   ██
██  █  ██ ██████  ███████ ██████
██ ███ ██ ██   ██ ██   ██ ██
 ███ ███  ██   ██ ██   ██ ██
*/

/** Gives an HTML/Markdown string that highlights the range for which the match happens */
export function wrap(str: string, query: string, options: IOptions = {}): string {
  if (!str || !query) {
    console.warn(`Zadeh: bad input to wrap str: ${str}, query: ${query}`)
    // @ts-ignore
    return []
  }
  parseOptions(options)
  return binding.wrap(str, query, options.pathSeparator as string /* stringified by parseOption */)
}

/*
 ██████  ████████ ██   ██ ███████ ██████
██    ██    ██    ██   ██ ██      ██   ██
██    ██    ██    ███████ █████   ██████
██    ██    ██    ██   ██ ██      ██   ██
 ██████     ██    ██   ██ ███████ ██   ██
*/

/** @deprecated: there is no major benefit by precomputing something just for the query. */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
export function prepareQuery(query: string, options: IOptions = {}): {} {
  console.warn(
    "Zadeh: prepareQuery is deprecated. There is no major benefit by precomputing something just for the query. "
  )
  // This is no - op since there is no major benefit by precomputing something
  // just for the query.
  return {}
}
