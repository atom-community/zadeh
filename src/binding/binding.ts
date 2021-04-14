import type { Tree, TreeFilterResult } from "./index"

export declare class Zadeh {
  constructor()

  filter(query: string, maxResult: number, usePathScoring: boolean, useExtensionBonus: boolean): Array<number>

  setArrayFiltererCandidates(candidateStrings: Array<string>): boolean

  filterTree(
    query: string,
    maxResult: number,
    usePathScoring: boolean,
    useExtensionBonus: boolean
  ): Array<TreeFilterResult>

  setTreeFiltererCandidates(candidateTrees: Array<Tree>, dataKey: string, childrenKey: string): boolean
}

export declare function score(
  candidate: string,
  query: string,
  usePathScoring: boolean,
  useExtensionBonus: boolean
): number

export declare function match(str: string, query: string, pathSeparator: string): Array<number>

export declare function wrap(str: string, query: string, pathSeparator: string): string
