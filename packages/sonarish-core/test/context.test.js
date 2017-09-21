/* @flow */
import test from 'ava'
import * as context from '../src/context'

test('context#createContext(opts)', t => {
  const ctx = context.createContext({})
  t.truthy(ctx.pluginInstanceMap.group)
  t.truthy(ctx.pluginInstanceMap.echo)
})
