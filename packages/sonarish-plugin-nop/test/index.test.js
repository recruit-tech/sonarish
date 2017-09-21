/* @flow */
import test from 'ava'
import { createContext, addPlugin, run } from 'sonarish-core'
import plugin from '../src'

test('Register self and run', async t => {
  const def = {
    type: 'nop',
    config: {}
  }

  const ctx = addPlugin(createContext(), plugin)
  const ret = await run(ctx, def, {})
  t.is(ret.score, 0)
  t.is(ret.rawResult.message, 'nop')
})
