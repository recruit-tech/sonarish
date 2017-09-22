/* @flow */
import flatten from 'lodash.flatten'
import groupBy from 'lodash.groupby'
import type { Context } from 'sonarish-types'
import * as eslintHelpers from './eslintHelpers'
import { norm, values } from './helpers'
import type { EnvOptions, RawDump } from './types'

export default function calcScore(
  ctx: Context,
  definition: {
    config: any
  },
  envOpts: EnvOptions
): {
  score: number,
  rawResult: RawDump
} {
  const cwd: any = envOpts.cwd || process.cwd()
  const { scoreMap, eslintOptions } = eslintHelpers.buildRuleset(
    definition.config
  )

  const result = eslintHelpers.exec(cwd, eslintOptions, envOpts)

  const messages = flatten(result.results.map(r => r.messages))
  const groupedMessages = groupBy(messages, m => m.ruleId)

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
