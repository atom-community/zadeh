export interface IOptions {

    /** @default false */
    allowErrors?: boolean

    /** @default true */
    usePathScoring?: boolean

    /** @default false */
    useExtensionBonus?: boolean

    pathSeparator?: '/' | '\\' | string

    // TODO not implemented?
    // optCharRegEx?: RegExp

    // TODO not implemented?
    // wrap?: { tagOpen?: string; tagClass?: string; tagClose?: string }

    /** @deprecated: there is no major benefit by precomputing something just for the query. */
    preparedQuery?: {}
}

export type IFilterOptions<T> = IOptions & {

    /** The key to use when candidates is an object */
    key?: T extends string ? never : keyof T

    /** The maximum numbers of results to return */
    maxResults?: number

    // TODO not implemented
    // maxInners?: number
}

/** Sort and filter the given candidates by matching them against the given query.
* @param candidates An array of strings or objects.
* @param query A string query to match each candidate against.
* @return returns an array of candidates sorted by best match against the query.
 */
export function filter<T>(
    data: T[],
    query: string,
    options?: IFilterOptions<T>
): T[]


/** Sort and filter the given Tree candidates by matching them against the given query.
* A tree object is an object which each entry stores the data in its dataKey and it has (may have) some children (with the similar structure) in its childrenKey
* @param candidates An array of tree objects.
* @param query A string query to match each candidate against.
* @param dataKey the key of the object (and its children) which holds the data
* @param childrenKey the key of the object (and its children) which hold the children
* @param options options
* @return returns an array of candidates sorted by best match against the query.
 */
export function filterTree<T>(
    candidates: T[],
    query: string,
    dataKey: string,
    childrenKey: string,
    options?: IFilterOptions<T>
): T[]

/** Score the given string against the given query.
* @param str The string the score.
* @param query The query to score the string against.
* @param options options
*/
export function score(str: string, query: string, options?: IOptions): number

/** Gives an array of indices at which the query matches the given string */
export function match(str: string, query: string, options?: IOptions): number[]

/** Gives an HTML/Markdown string that highlights the range for which the match happens */
export function wrap(str: string, query: string, options?: IOptions): string

/** @deprecated: there is no major benefit by precomputing something just for the query. */
export function prepareQuery(query: string, options?: IOptions): {}
