/* @flow */
import test from 'ava'
import { run, createContext } from '../src/context'

test('echo#calcScore with 0', t => {
  const def = {
    type: 'echo',
    config: {
      score: 0
    }
  }
  const ret = run(createContext(), def)
  t.is(ret.score, 0)
})

test('echo#calcScore with 1', t => {
  const def = {
    type: 'echo',
    config: {
      score: 1
    }
  }

  const ret = run(createContext(), def)
  t.is(ret.score, 1)
})
