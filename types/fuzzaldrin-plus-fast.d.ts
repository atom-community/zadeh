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

/** ArrayFilterer is a class that allows to set the `candidates` only once and perform filtering on them multiple times.
 *  This is much more efficient than calling the `filter` function directly.
 */
export class ArrayFilterer<T> {
    constructor()

    /** The method to set the candidates that are going to be filtered
     * @param candidates An array of tree objects.
     * @param dataKey (optional) if `candidates` is an array of objects, pass the key in the object which holds the data. dataKey can be the options object passed to `filter` method (but this is deprecated).
     */
    setCandidates<T>(candidates: Array<T>, dataKey?: string): void

    /** The method to perform the filtering on the already set candidates
     *  @param query A string query to match each candidate against.
     *  @param options options
     *  @return returns an array of candidates sorted by best match against the query.
     */
    filter(query: string, options: IFilterOptions<T>): Array<T>
}

/** Sort and filter the given candidates by matching them against the given query.
* @param candidates An array of strings or objects.
* @param query A string query to match each candidate against.
* @param options options
* @return returns an array of candidates sorted by best match against the query.
 */
export function filter<T>(
    candidates: T[],
    query: string,
    options?: IFilterOptions<T>
): T[]


/** Sort and filter the given Tree candidates by matching them against the given query.
* A tree object is an object in which each entry stores the data in its dataKey and it has (may have) some children (with a similar structure) in its childrenKey
* @param candidates An array of tree objects.
* @param query A string query to match each candidate against.
* @param dataKey the key of the object (and its children) which holds the data
* @param childrenKey the key of the object (and its children) which hold the children
* @param options options
* @return An array of candidate objects in form of `{data, index, level}` sorted by best match against the query. Each objects has the address of the object in the tree using `index` and `level`.
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
