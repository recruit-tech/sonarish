#!/usr/bin/env node
import { buildEslintRuleset, calcStats } from 'sonarish-core'
import rulesetList from 'sonarish-ruleset/recommended'
import { execEslintOnProject } from './commands'

// eslint-disable-next-line
const argv = require('minimist')(process.argv.slice(2))

const [$0] = argv._

if ($0) {
  // const result = commands.genEslintResult($0, rulesetList)
  rulesetList.map(ruleset => {
    const { eslintOptions, scoreMap } = buildEslintRuleset(ruleset)
    const rawResult = execEslintOnProject($0, eslintOptions)
    const stats = calcStats(rawResult, scoreMap)
    console.log('---', ruleset.name)
    console.log(stats)
  })

  // console.log('TODO: calcStats', result)
} else {
  console.log(`sonarish <path> [--scoreRules <sonarishrc-path>] [--no-default-rules]
  `)
}
