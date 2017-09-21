/* @flow */
export const norm = (count: number, threshold?: number = 100) => {
  return Math.sqrt(Math.min(count, threshold) / threshold)
}

export const values: <V>({ [string]: V }) => V[] = (Object.values: any)
export const entries: <K, V>({ [K]: V }) => Array<
  [K, V]
> = (Object.entries: any)
