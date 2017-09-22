/* @flow */
import 'babel-polyfill'
import fs from 'fs'
import prettyjson from 'prettyjson'
import { toRootDefinition, format, run, createContext } from 'sonarish-core'
import defaultDefinition from './defaultDefinition'

export default async (opts: {
  cwd?: string,
  f?: string,
  raw?: boolean,
  json?: boolean
}) => {
  if (opts.help || opts.h) {
    console.log(`sonarish [<dir-a> <dir-b> ...] [--root <projectRoot>]`)
  }

  const def = opts.f
    ? JSON.parse(fs.readFileSync(opts.f).toString())
    : defaultDefinition
  const rootBundleDef = toRootDefinition(def.scoreMap)

  const ctx = createContext()

  const result = await run(ctx, rootBundleDef, opts)

  if (opts.raw) {
    console.log(prettyjson.render(result))
  } else if (opts.json) {
    console.log(JSON.stringify(result))
  } else {
    console.log(format(ctx, 'group', result.rawResult))
  }
}
