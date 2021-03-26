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

export type IFilterOptions<T> = IOptions & {
  /** @deprecated The key to use when candidates is an object
   * Deprecated option. Pass the key as a string to the second argument of 'ArrayFilterer.setCandidates' or to the third argument of 'filter'
   */
  key?: T extends string ? never : keyof T

  /** The maximum numbers of results to return */
  maxResults?: number

  // TODO not implemented
  // maxInners?: number
}
