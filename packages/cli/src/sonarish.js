/* @flow */
import path from 'path'
import { buildEslintRuleset, calcStats } from 'sonarish-core'
import rulesetList from 'sonarish-ruleset/es201x'
import Table from 'cli-table2'
import { execEslintOnProject, getDefaultEslintConfig } from './commands'
import { makeUrlAbsolute } from './util'

// eslint-disable-next-line
const argv = require('minimist')(process.argv.slice(2))
const entries: any = Object.entries

function format(stats: any) {
  const viewableScore = Math.floor((1 - stats.totalScore) * 1000) / 10
  return `score: ${viewableScore}/100`
}

function overrideScoreMapByDefaultRules(scoreMap, defaultRules) {
  return entries(defaultRules).reduce((acc, [rule, opts]) => {
    const criteria = opts.length ? opts[0] : opts
    const isIgnored = criteria === 0 || criteria === 'off'
    // skip if rule is included as error
    if (!isIgnored) {
      return acc
    }
    return { ...acc, [rule]: 0 }
  }, scoreMap)
}

if (argv.help || argv.h) {
  console.log(`sonarish [<dir-a> <dir-b> ...] [--root <projectRoot>]`)
}

const maybeRoot = argv.root || argv.r
const root = maybeRoot ? makeUrlAbsolute(maybeRoot) : process.cwd()

const defaultEslintConfig = getDefaultEslintConfig(root, {})

rulesetList.map(ruleset => {
  const { eslintOptions, scoreMap: originalScoreMap } = buildEslintRuleset(
    ruleset
  )

  const scoreMap = overrideScoreMapByDefaultRules(
    originalScoreMap,
    defaultEslintConfig.rules
  )

  // const { eslintOptions, scoreMap } = buildEslintRuleset(ruleset)
  const target = argv.target || ''
  const execPath = path.join(root, target)
  const rawResult = execEslintOnProject(execPath, argv._, eslintOptions)
  const stats = calcStats(rawResult, scoreMap)
  console.log('---', ruleset.name)
  console.log(format(stats))
  if (argv.detail) {
    const table = new Table({
      head: ['rule', 'score', 'priority', 'count']
    })

    const scores = entries(stats.scoresByRule)
    scores.sort(([_0, a], [_1, b]) => b.point - a.point)

    for (const [key, score] of scores) {
      const p = -(~~(score.point * 1000) / 10)
      table.push([key, p, score.priority, score.count])
    }
    console.log(table.toString())
  }
})

if (!argv.detail) {
  console.log('\nuse --detail to know more')
}
