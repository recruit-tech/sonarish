/* @flow */
import test from 'ava'
import report from '../src/'

test('report', async t => {
  const opts = {
    plugins: [],
    definition: {
      type: 'group',
      config: {
        rules: [
          {
            name: 'nested',
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

  const ret = await report(opts, {})
  t.is(ret.score, 1)
})
