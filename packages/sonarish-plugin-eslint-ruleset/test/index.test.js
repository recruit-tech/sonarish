/* @flow */
import path from 'path'
import test from 'ava'
import { createContext, addPlugin, run } from 'sonarish-core'
import plugin from '../src'

test('Register self and run', async t => {
  const def = {
    type: 'eslint-ruleset',
    config: {
      eslintOptions: {
        parser: 'babel-eslint'
      },
      scoreMap: {
        'no-unused-vars': 1
      }
    }
  }

  const ctx = addPlugin(createContext(), plugin)
  const cwd = path.join(__dirname, 'fixtures/eslint-target')
  const ret = await run(ctx, def, {
    cwd,
    _: [cwd]
  })
  t.is(ret.score, 0)
})
