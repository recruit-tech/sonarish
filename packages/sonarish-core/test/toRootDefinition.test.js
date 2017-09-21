/* @flow */
import test from 'ava'
import toRootDefinition from '../src/toRootDefinition'

test(t => {
  const input = {
    r1: ['echo', 1, { score: 1 }],
    r2: ['echo', 3, { score: 0 }],
    b1: [
      'group',
      1,
      {
        n1: ['echo', 1, { score: 1 }]
      }
    ]
  }

  const expected = {
    type: 'group',
    config: {
      rules: [
        {
          name: 'r1',
          priority: 1,
          definition: {
            type: 'echo',
            config: {
              score: 1
            }
          }
        },
        {
          name: 'r2',
          priority: 3,
          definition: {
            type: 'echo',
            config: {
              score: 0
            }
          }
        },
        {
          name: 'b1',
          priority: 1,
          definition: {
            type: 'group',
            config: {
              rules: [
                {
                  name: 'n1',
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
  t.deepEqual(toRootDefinition(input), expected)
})
