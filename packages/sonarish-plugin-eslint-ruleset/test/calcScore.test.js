/* @flow */
import path from 'path'
import test from 'ava'
import { createContext } from 'sonarish-core'
import calcScore from '../src/calcScore'

test('calcScore: Fail all', t => {
  const def = {
    config: {
      eslintOptions: {
        parser: 'babel-eslint'
      },
      scoreMap: { 'no-unused-vars': 1 }
    }
  }
  const ctx = createContext()
  const cwd = path.join(__dirname, 'fixtures/eslint-target')
  const ret = calcScore(
    ctx,
    def,
    {
      cwd,
      _: [cwd]
    },
    {}
  )
  t.is(ret.score, 0)
})

test('calcScore: Same priorities and fail half => 0.5', t => {
  const def = {
    config: {
      eslintOptions: {
        parser: 'babel-eslint'
      },
      scoreMap: { 'no-unused-vars': 1, 'prefer-arrow-callback': 1 }
    }
  }
  const ctx = createContext()
  const cwd = path.join(__dirname, 'fixtures/eslint-target')
  const ret = calcScore(ctx, def, {
    cwd,
    _: [cwd]
  })
  t.is(ret.score, 0.5)
})
