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

type stringWithLength1 = string

export interface IOptions {
  /** @default false */
  allowErrors?: boolean

  /** @default true */
  usePathScoring?: boolean

  /** @default false */
  useExtensionBonus?: boolean

  /**
   * A path separator which is a string with length 1. Such as "/" or "". By default, this is chosen based on the
   * operating system.
   */
  pathSeparator?: "/" | "\\" | stringWithLength1

  // TODO not implemented?
  // optCharRegEx?: RegExp

  // TODO not implemented?
  // wrap?: { tagOpen?: string; tagClass?: string; tagClose?: string }

  /** @deprecated: there is no major benefit by precomputing something just for the query. */
  preparedQuery?: never
}

export type StringArrayFilterOptions = IOptions & {
  /** The maximum numbers of results to return */
  maxResults?: number

  // TODO not implemented
  // maxInners?: number
}

export type ObjectArrayFilterOptions = StringArrayFilterOptions
export type TreeFilterOptions = StringArrayFilterOptions

/** @deprecated The key to use when candidates is an object Deprecated option. */
export type DeprecatedFilterOptions<T extends StringOrObjectArray> = IOptions & {
  key?: T extends string ? never : keyof T
}

const defaultPathSeparator = process.platform === "win32" ? "\\" : "/"

function parseOptions(options: IOptions) {
  // options.allowErrors ? = false
  if (options.usePathScoring === undefined) {
    options.usePathScoring = true
  }
  // options.useExtensionBonus ? = false
  if (options.pathSeparator === undefined) {
    options.pathSeparator = defaultPathSeparator
  }
}

function parseFilterOptions(filterOptions: StringArrayFilterOptions | ObjectArrayFilterOptions | TreeFilterOptions) {
  // options.optCharRegEx ? = null
  // options.wrap ? = null
  if (filterOptions.maxResults === undefined) {
    filterOptions.maxResults = 0
  }
  // parse common options
  parseOptions(filterOptions)
}

/*
 █████  ██████  ██████   █████  ██    ██     ███████ ██ ██   ████████ ███████ ██████
██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██      ██ ██      ██    ██      ██   ██
███████ ██████  ██████  ███████   ████       █████   ██ ██      ██    █████   ██████
██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██ ██      ██    ██      ██   ██
██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██ ███████ ██    ███████ ██   ██
*/

/** An object that stores its `dataKey` in `DataKey` */
export type ObjectWithKey<DataKey extends string | number = string | number> = {
  [dk in DataKey]: string
} &
  Record<string | number, string>

export type StringOrObjectArray = string | ObjectWithKey

/** StringArrayFilterer is a class that performs filtering on an array of strings */
export class StringArrayFilterer {
  obj = new binding.Zadeh()
  // typescript cannot detect that candidates is definitely assigned
  // @ts-ignore
  private candidates: Array<string>

  /**
   * Make a `StringArrayFilterer` for the candidates that are going to be filtered.
   *
   * @param candidates An array of strings.
   */
  constructor(candidates?: Array<string>) {
    if (candidates !== undefined) {
      this.setCandidates(candidates)
    } else {
      this.candidates = []
    }
  }

  /**
   * The method to set the candidates that are going to be filtered
   *
   * @param candidates An array of strings.
   */
  setCandidates(candidates: Array<string>) {
    this.candidates = candidates

    Binding.validate_setArrayFiltererCandidates(candidates)
    return this.obj.setArrayFiltererCandidates(candidates)
  }

  /**
   * Filter the already set array of strings
   *
   * @param query A string query to match each candidate against.
   * @param options Options
   * @returns Returns an array of candidates sorted by best match against the query.
   */
  filter(query: string, options: StringArrayFilterOptions = {}): Array<string> {
    return this.filterIndices(query, options).map((ind: number) => this.candidates[ind])
  }

  /**
   * Filter the already set array of strings and get the indices of the chosen candidate
   *
   * @param query A string query to match each candidate against.
   * @param options Options
   * @returns Returns an array of numbers indicating the index of the chosen candidate sorted by best match against the query.
   */
  filterIndices(query: string, options: StringArrayFilterOptions = {}): Array<number> {
    parseFilterOptions(options)

    const maxResult = options.maxResults as number /* numberified by parseFilterOptions */
    const usePathScoring = Boolean(options.usePathScoring)
    const useExtensionBonus = Boolean(options.useExtensionBonus)

    Binding.validate_filter(query, maxResult, usePathScoring, useExtensionBonus)
    // NOTE calling obj.filter is slower than (obj.filterIndices then map) due to the interop overhead
    return this.obj.filterIndices(query, maxResult, usePathScoring, useExtensionBonus)
  }
}

/**
 * ObjectArrayFilterer is a class that performs filtering on an array of objects based on a string stored in the given
 * `dataKey` for each object
 */
export class ObjectArrayFilterer<DataKey extends string | number = string> {
  obj = new binding.Zadeh()
  // typescript cannot detect that candidates is definitely assigned
  // @ts-ignore
  private candidates: ObjectWithKey<DataKey>[]

  /**
   * Make a `ObjectArrayFilterer` for the candidates that are going to be filtered.
   *
   * @param candidates An array of objects.
   * @param dataKey The key which is indexed for each object, and filtering is done based on the resulting string
   */
  constructor(candidates?: ObjectWithKey<DataKey>[], dataKey?: DataKey) {
    if (candidates !== undefined && dataKey !== undefined) {
      this.setCandidates(candidates, dataKey)
    } else {
      this.candidates = []
    }
  }

  /**
   * Allows to set the candidates (if changed or not set in the constructor).
   *
   * @param candidates An array of objects.
   * @param dataKey The key which is indexed for each object, and filtering is done based on the resulting string
   */
  setCandidates(candidates: ObjectWithKey<DataKey>[], dataKey: DataKey) {
    this.candidates = candidates
    const candidatesKeys = candidates.map((item) => item[dataKey])

    Binding.validate_setArrayFiltererCandidates(candidatesKeys)
    this.obj.setArrayFiltererCandidates(candidatesKeys)
  }

  /**
   * Filter the already set objects
   *
   * @param query A string query to match the dataKey of each candidate against.
   * @param options Options
   * @returns Returns an array of objects sorted by best match against the query.
   */
  filter(query: string, options: ObjectArrayFilterOptions = {}): ObjectWithKey<DataKey>[] {
    return this.filterIndices(query, options).map((ind: number) => this.candidates[ind])
  }

  /**
   * Filter the already set array of objects and get the indices of the chosen candidate
   *
   * @param query A string query to match the dataKey of each candidate against.
   * @param options Options
   * @returns Returns an array of numbers indicating the index of the chosen candidate sorted by best match against the query.
   */
  filterIndices(query: string, options: StringArrayFilterOptions = {}): Array<number> {
    parseFilterOptions(options)

    const maxResult = options.maxResults as number /* numberified by parseFilterOptions */
    const usePathScoring = Boolean(options.usePathScoring)
    const useExtensionBonus = Boolean(options.useExtensionBonus)

    Binding.validate_filter(query, maxResult, usePathScoring, useExtensionBonus)
    if (query.length === 0) {
      // optimization for query === ""
      return []
    }
    // NOTE calling obj.filter is slower than (obj.filterIndices then map) due to the interop overhead
    return this.obj.filterIndices(query, maxResult, usePathScoring, useExtensionBonus)
  }
}

/** @deprecated */
type DeprecatedFilterReturn<T> = T extends string ? string[] : ObjectWithKey[]

let warnStringArrayFilterer = true
let warnfilterObjectArrayFilterer = true

/**
 * @deprecated Use `StringArrayFilterer` or `ObjectArrayFilterer` instead Sort and filter the given candidates by
 *   matching them against the given query.
 * @param candidates An array of strings or objects.
 * @param query A string query to match each candidate against.
 * @param options Options
 * @returns Returns an array of candidates sorted by best match against the query.
 */
export function filter<T extends StringOrObjectArray>(
  candidates: T[],
  query: string,
  options: DeprecatedFilterOptions<T> = {}
): DeprecatedFilterReturn<T> {
  if (!candidates || !query) {
    console.warn(`Zadeh: bad input to filter candidates: ${candidates}, query: ${query}`)
    // @ts-ignore: bad input guard which doesn't meet the types
    return []
  }

  if (typeof candidates[0] === "object" && options.key) {
    // an object (options) containing the key
    if (warnfilterObjectArrayFilterer) {
      console.warn(`Zadeh: deprecated function. Use 'ObjectArrayFilterer' instead`)
      warnfilterObjectArrayFilterer = false
    }
    const dataKey = options.key
    const objectArrayFilterer = new ObjectArrayFilterer(
      candidates as ObjectWithKey<T extends string ? never : keyof T>[],
      dataKey
    )
    return objectArrayFilterer.filter(query, options) as DeprecatedFilterReturn<T>
  } else if (typeof candidates[0] === "string") {
    // string array
    if (warnStringArrayFilterer) {
      console.warn(`Zadeh: deprecated function. Use 'StringArrayFilterer' instead`)
      warnStringArrayFilterer = false
    }
    const stringArrayFilterer = new StringArrayFilterer(candidates as string[])
    return stringArrayFilterer.filter(query, options) as DeprecatedFilterReturn<T>
  } else {
    throw new Error(`Zadeh: bad input to filter candidates: ${candidates}, query: ${query}, options: ${options}`)
  }
}

/*
████████ ██████  ███████ ███████     ███████ ██ ██   ████████ ███████ ██████
   ██    ██   ██ ██      ██          ██      ██ ██      ██    ██      ██   ██
   ██    ██████  █████   █████       █████   ██ ██      ██    █████   ██████
   ██    ██   ██ ██      ██          ██      ██ ██      ██    ██      ██   ██
   ██    ██   ██ ███████ ███████     ██      ██ ███████ ██    ███████ ██   ██
*/

// The object (an element of the array) returned from filtering trees. It has the address of the object in the tree using `index` and `parent_indices`.
export interface TreeFilterIndicesResult {
  data: string
  index: number
  parent_indices: Array<number>
}

/**
 * TreeFilterer is a filters the given query in the nodes of the given array of trees, and returns an array of filtered
 * tree. A tree object is an object in which each entry stores the data in its dataKey and it has (may have) some
 * children (with a similar structure) in its childrenKey
 */
export class TreeFilterer<DataKey extends string = string, ChildrenKey extends string = string> {
  obj = new binding.Zadeh()
  // typescript cannot detect that candidates is definitely assigned
  // @ts-ignore
  private candidates: Tree<DataKey, ChildrenKey>[]

  /**
   * The method to set an array of trees that are going to be filtered
   *
   * @param candidates An array of tree objects.
   * @param dataKey The key of the object (and its children) which holds the data (defaults to `"data"`)
   * @param childrenKey The key of the object (and its children) which hold the children (defaults to `"children"`)
   */
  constructor(
    candidates?: Tree<DataKey, ChildrenKey>[],
    dataKey: DataKey = "data" as DataKey,
    childrenKey: ChildrenKey = "children" as ChildrenKey
  ) {
    if (candidates) {
      this.setCandidates(candidates, dataKey, childrenKey)
    } else {
      this.candidates = []
    }
  }

  /**
   * The method to set an array of trees that are going to be filtered
   *
   * @param candidates An array of tree objects.
   * @param dataKey The key of the object (and its children) which holds the data (defaults to `"data"`)
   * @param childrenKey The key of the object (and its children) which hold the children (defaults to `"children"`)
   */
  setCandidates(
    candidates: Tree<DataKey, ChildrenKey>[],
    dataKey: DataKey = "data" as DataKey,
    childrenKey: ChildrenKey = "children" as ChildrenKey
  ) {
    this.candidates = candidates

    Binding.validate_setTreeFiltererCandidates(candidates, dataKey, childrenKey)
    return this.obj.setTreeFiltererCandidates(candidates, dataKey, childrenKey)
  }

  /**
   * Filter the already set trees
   *
   * @param query A string query to match the dataKey of each candidate against.
   * @param options Options
   * @returns {Tree[]} An array of filtered trees. In a tree, the filtered data is at the last level (if it has
   *   children, they are not included in the filered tree)
   */
  filter(query: string, options: TreeFilterOptions = {}): Tree<DataKey, ChildrenKey>[] {
    parseFilterOptions(options)

    const maxResult = options.maxResults as number /* numberified by parseFilterOptions */
    const usePathScoring = Boolean(options.usePathScoring)
    const useExtensionBonus = Boolean(options.useExtensionBonus)

    Binding.validate_filterTree(query, maxResult, usePathScoring, useExtensionBonus)
    if (query.length === 0) {
      // optimization for query === ""
      return []
    }
    return this.obj.filterTree(query, maxResult, usePathScoring, useExtensionBonus)
  }

  /**
   * The method to perform the filtering on the already set candidates
   *
   * @param query A string query to match the dataKey of each candidate against.
   * @param options Options
   * @returns {TreeFilterIndicesResult[]} An array candidate objects in form of `{data, index, parentIndices}` sorted by
   *   best match against the query. Each objects has the address of the object in the tree using `index` and `parent_indices`
   */
  filterIndices(query: string, options: TreeFilterOptions = {}): TreeFilterIndicesResult[] {
    parseOptions(options)
    if (query.length === 0) {
      // optimization for query === ""
      return []
    }
    return this.obj.filterIndicesTree(
      query,
      options.maxResults ?? 0,
      Boolean(options.usePathScoring),
      Boolean(options.useExtensionBonus)
    )
  }
}

export type TreeDataProperty<DataKey extends string> = {
  [dk in DataKey]: string
}
export type TreeChildrenProperty<ChildrenKey extends string> = {
  [ck in ChildrenKey]?: string[] // children is either an array or not provided
}
/**
 * A {Tree} object is an object in which each entry stores the data in its dataKey and it has (may have) some children
 * (with a similar structure) in its childrenKey
 */
export type Tree<DataKey extends string = string, ChildrenKey extends string = string> = TreeDataProperty<DataKey> &
  TreeChildrenProperty<ChildrenKey>

/*
███████  ██████  ██████  ██████  ███████
██      ██      ██    ██ ██   ██ ██
███████ ██      ██    ██ ██████  █████
     ██ ██      ██    ██ ██   ██ ██
███████  ██████  ██████  ██   ██ ███████
*/

/**
 * Score the given string against the given query.
 *
 * @param candidate The string the score.
 * @param query The query to score the string against.
 * @param options Options
 */
export function score(candidate: string, query: string, options: IOptions = {}): number {
  if (!candidate || !query) {
    console.warn(`Zadeh: bad input to score candidates: ${candidate}, query: ${query}`)
    return 0
  }
  parseOptions(options)

  const usePathScoring = Boolean(options.usePathScoring)
  const useExtensionBonus = Boolean(options.useExtensionBonus)

  Binding.validate_score(candidate, query, usePathScoring, useExtensionBonus)
  return binding.score(candidate, query, usePathScoring, useExtensionBonus)
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

  const pathSeparator = options.pathSeparator as string /* stringified by parseOption */

  Binding.validate_match(str, query, pathSeparator)
  return binding.match(str, query, pathSeparator)
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

  const pathSeparator = options.pathSeparator as string /* stringified by parseOption */

  Binding.validate_wrap(str, query, pathSeparator)
  return binding.wrap(str, query, pathSeparator)
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
