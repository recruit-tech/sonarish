/* @flow */
export type RawDump = {
  scoreResultMap: {
    [string]: {
      count: number,
      point: number,
      priority: number,
      weight: number
    }
  }
}
