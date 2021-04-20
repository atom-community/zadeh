import type { Tree, TreeFilterIndicesResult } from "./index"

export declare class Zadeh {
  constructor()

  filter(query: string, maxResult: number, usePathScoring: boolean, useExtensionBonus: boolean): Array<string>
  filterIndices(query: string, maxResult: number, usePathScoring: boolean, useExtensionBonus: boolean): Array<number>

  setArrayFiltererCandidates(candidateStrings: Array<string>): boolean

  filterTree(query: string, maxResult: number, usePathScoring: boolean, useExtensionBonus: boolean): Array<Tree>

  filterIndicesTree(
    query: string,
    maxResult: number,
    usePathScoring: boolean,
    useExtensionBonus: boolean
  ): Array<TreeFilterIndicesResult>

  // TODO use generic Tree type
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

// Argument validators

export function validate_filter(...args: Parameters<Zadeh["filter"]>) {
  if (
    !(
      typeof args[0] === "string" &&
      typeof args[1] === "number" &&
      typeof args[2] === "boolean" &&
      typeof args[3] === "boolean"
    )
  ) {
    throw new Error(`Invalid arguments for filter: ${args}`)
  }
}

export function validate_setArrayFiltererCandidates(...args: Parameters<Zadeh["setArrayFiltererCandidates"]>) {
  if (!Array.isArray(args[0])) {
    throw new Error(`Invalid arguments for setArrayFiltererCandidates: ${args}`)
  }
}

export function validate_filterTree(...args: Parameters<Zadeh["filterIndicesTree"]>) {
  if (
    !(
      typeof args[0] === "string" &&
      typeof args[1] === "number" &&
      typeof args[2] === "boolean" &&
      typeof args[3] === "boolean"
    )
  ) {
    throw new Error(`Invalid arguments for filterTree: ${args}`)
  }
}

export function validate_setTreeFiltererCandidates(...args: Parameters<Zadeh["setTreeFiltererCandidates"]>) {
  if (!(Array.isArray(args[0]) && typeof args[1] === "string" && typeof args[2] === "string")) {
    throw new Error(`Invalid arguments for setTreeFiltererCandidates: ${args}`)
  }
}

export function validate_score(...args: Parameters<typeof score>) {
  if (
    !(
      typeof args[0] === "string" &&
      typeof args[1] === "string" &&
      typeof args[2] === "boolean" &&
      typeof args[3] === "boolean"
    )
  ) {
    throw new Error(`Invalid arguments for score: ${args}`)
  }
}

export function validate_match(...args: Parameters<typeof match>) {
  if (
    !(
      typeof args[0] === "string" &&
      typeof args[1] === "string" &&
      typeof args[2] === "string" &&
      /** PathSeparator */ args[2].length === 1
    )
  ) {
    throw new Error(`Invalid arguments for match: ${args}`)
  }
}

export function validate_wrap(...args: Parameters<typeof wrap>) {
  if (
    !(
      typeof args[0] === "string" &&
      typeof args[1] === "string" &&
      typeof args[2] === "string" &&
      /** PathSeparator */ args[2].length === 1
    )
  ) {
    throw new Error(`Invalid arguments for wrap: ${args}`)
  }
}
