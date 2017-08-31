/* @flow */
import path from 'path'
import { buildEslintRuleset, calcStats } from 'sonarish-core'
import rulesetList from 'sonarish-ruleset/es201x'
import Table from 'cli-table2'
import { execEslintOnProject } from './commands'
import { makeUrlAbsolute } from './util'

// eslint-disable-next-line
const argv = require('minimist')(process.argv.slice(2))
const entries: any = Object.entries

const [$0] = argv._

function format(stats: any) {
  const viewableScore = Math.floor((1 - stats.totalScore) * 1000) / 10
  return `score: ${viewableScore}/100`
}

if ($0) {
  rulesetList.map(ruleset => {
    const { eslintOptions, scoreMap } = buildEslintRuleset(ruleset)
    const target = argv.target || ''
    const execPath = path.join($0, target)
    const rawResult = execEslintOnProject(execPath, eslintOptions)
    const stats = calcStats(rawResult, scoreMap)
    console.log('---', ruleset.name)
    console.log(format(stats))
    if (argv.detail) {
      const table = new Table({
        head: ['rule', 'score', 'priority', 'count']
      })

      const scores = Object.entries(stats.scoresByRule)
      scores.sort(([_0, a], [_1, b]) => b.point - a.point)

      for (const [key, score] of scores) {
        const p = -(~~(score.point * 1000) / 10)
        // table.push({ score: p }, { count: score.count })
        table.push([key, p, score.priority, score.count])
        // console.log('    ', key, p, '--', score.count)
        // console.log(`    ${key} score:${p} violation:${score.count}`)
      }
      console.log(table.toString())
    }
  })

  if (!argv.detail) {
    console.log('\nuse --detail to know detail')
  }

  // console.log('TODO: calcStats', result)
} else {
  console.log(`sonarish <path> [--scoreRules <sonarishrc-path>] [--no-default-rules]
  `)
}
