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

export type EslintOptions = {
  cwd: ?string,
  ignore?: boolean,
  ignorePath?: ?string,
  ignorePattern?: string[]
}

export type EnvOptions = {
  _: string[]
}
