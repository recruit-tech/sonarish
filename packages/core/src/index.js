import path from 'path'
import fs from 'fs'
import { CLIEngine } from 'eslint'
import RULESETS from 'sonarish-ruleset'

const ERR = 2

const createEngine = (ruleset, priority) => {
  return new CLIEngine({
    useEslintrc: false,
    parser: 'babel-eslint',
    plugins: ruleset.plugins,
    rules: ruleset.rulesWithPriority
      .filter(i => i.priority === priority)
      .reduce((acc, next) => {
        return Object.assign(acc, {
          [next.rule]: [ERR].concat(next.args || [])
        })
      }, {})
  })
}

const engines: RulesetEngine = RULESETS.map(r => ({
  rulesetName: r.rulesetName,
  cliByPriority: [
    createEngine(r, 0),
    createEngine(r, 1),
    createEngine(r, 2),
    createEngine(r, 3)
  ].reverse()
}))

export function report(projectPath: string) {
  return engines.map(e => ({
    rulesets: RULESETS,
    rulesetName: e.rulesetName,
    rulesetResult: e.cliByPriority.map(cli => cli.executeOnFiles([projectPath]))
  }))
}
