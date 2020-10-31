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
