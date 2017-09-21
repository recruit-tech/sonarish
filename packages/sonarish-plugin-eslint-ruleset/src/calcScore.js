/* @flow */
import flatten from 'lodash.flatten'
import groupBy from 'lodash.groupby'
import type { Context, Options } from 'sonarish-types'
import { execEslint, buildEslintRuleset } from './eslintHelpers'
import { norm, values } from './helpers'
import type { RawDump } from './types'

export default function calcScore(
  ctx: Context,
  definition: {
    config: any
  },
  opts: Options
): {
  score: number,
  rawResult: RawDump
} {
  const cwd: any = opts.cwd || process.cwd()
  const { scoreMap, eslintOptions } = buildEslintRuleset(definition.config)

  const result = execEslint(cwd, opts._ || [], eslintOptions)

  const messages = flatten(result.results.map(r => r.messages))
  const groupedMessages = groupBy(messages, m => m.ruleId)
  console.log('raw eslint result', messages)

  const rules = Object.keys(groupedMessages).filter(i => !!i && i !== 'null')

  const sumOfPriorities = values(scoreMap).reduce((sum, i) => sum + i, 0)

  // Consider file count to drop point in small project
  const threshold = Math.min(100, result.results.length)

  const scoreResultMap = rules
    .map(rule => {
      const ruleStat = groupedMessages[rule]
      const count = ruleStat.length || 0
      const priority = scoreMap[rule] || 0
      const weight = priority / sumOfPriorities
      const point = norm(count, threshold) * weight
      return {
        [rule]: {
          count,
          priority,
          weight,
          point
        }
      }
    })
    .reduce((acc, r) => ({ ...acc, ...r }), {})

  const score = values(scoreResultMap).reduce(
    (sum: number, i) => sum + i.point,
    0
  )

  return {
    score: 1 - score,
    type: 'eslint-ruleset',
    rawResult: {
      scoreResultMap
    }
  }
}
