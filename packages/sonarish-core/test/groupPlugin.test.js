/* @flow */
import test from 'ava'
import { run, createContext } from '../src/context'

test('group.calcScore', async t => {
  const def = {
    type: 'group',
    config: {
      rules: [
        {
          name: 'echo-1',
          priority: 1,
          definition: {
            type: 'echo',
            config: {
              score: 1
            },
            priority: 1
          }
        }
      ]
    }
  }

  const ret = await run(createContext(), def)
  t.is(ret.score, 1)
})

test('groupPlugin.calcScore: nested', async t => {
  const def = {
    type: 'group',
    config: {
      rules: [
        {
          name: 'nested-depth-0',
          priority: 1,
          definition: {
            type: 'group',
            config: {
              rules: [
                {
                  name: 'nested-depth-1',
                  priority: 1,
                  definition: {
                    type: 'echo',
                    config: {
                      score: 1
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }

  const ret = await run(createContext(), def)
  t.is(ret.score, 1)
})

test('group.calcScore: with priority weight', async t => {
  const def = {
    type: 'group',
    config: {
      rules: [
        {
          name: 'echo-1',
          priority: 1,
          definition: {
            type: 'echo',
            config: {
              score: 1
            }
          }
        },
        {
          name: 'echo-2',
          priority: 3,
          definition: {
            type: 'echo',
            config: {
              score: 0
            }
          }
        }
      ]
    }
  }

  const ret = await run(createContext(), def)
  t.is(ret.score, 0.25)
})
