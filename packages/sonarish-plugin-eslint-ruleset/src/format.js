/* @flow */
import Table from 'cli-table2'
import { entries } from './helpers'
import type { RawDump } from './types'

export default function format(_ctx: any, result: RawDump) {
  const table = new Table({
    head: ['rule', 'score', 'priority', 'count']
  })

  const scores = entries(result.scoreResultMap)
  scores.sort(([_0, a], [_1, b]) => b.point - a.point)

  for (const [key, score] of scores) {
    const p = -(~~(score.point * 1000) / 10)
    table.push([key, p, score.priority, score.count])
  }

  return 'eslint-ruleset:\n' + table.toString()
}
