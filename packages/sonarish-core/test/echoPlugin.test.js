/* @flow */
import test from 'ava'
import { run, createContext } from '../src/context'

test('echo#calcScore with 0', async t => {
  const def = {
    type: 'echo',
    config: {
      score: 0
    }
  }
  const ret = await run(createContext(), def)
  t.is(ret.score, 0)
})

test('echo#calcScore with 1', async t => {
  const def = {
    type: 'echo',
    config: {
      score: 1
    }
  }

  const ret = await run(createContext(), def)
  t.is(ret.score, 1)
})
