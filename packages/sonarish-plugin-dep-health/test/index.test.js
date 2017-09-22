/* @flow */
import 'babel-polyfill'
import path from 'path'
import test from 'ava'
import { createContext, addPlugin, run } from 'sonarish-core'
import plugin from '../src'

test('calcScore', async t => {
  const def = {
    type: 'dep-health',
    config: {}
  }

  const ctx = addPlugin(createContext(), plugin)
  const ret = await run(ctx, def, {
    cwd: path.join(__dirname, 'fixtures/old-react-app')
  })
  t.true(ret.score < 1)
})
