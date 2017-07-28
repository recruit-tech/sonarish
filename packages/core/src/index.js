/* @flow */
import { CLIEngine } from 'eslint'
import RULESETS from 'sonarish-ruleset'
import groupBy from 'lodash.groupby'

const ERR = 2

const createEngine = (ruleset, priority) => {
  return new CLIEngine({
    useEslintrc: false,
    parser: 'babel-eslint',
    presets: ruleset.presets,
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

const engines = RULESETS.map(r => ({
  rulesetName: r.rulesetName,
  clis: groupBy(
    [
      { priority: 0, cli: createEngine(r, 0) },
      { priority: 1, cli: createEngine(r, 1) },
      { priority: 2, cli: createEngine(r, 2) },
      { priority: 3, cli: createEngine(r, 3) }
    ],
    i => i.priority
  )
}))

export function report(projectPath: string) {
  return engines.map(e => ({
    rulesets: RULESETS,
    rulesetName: e.rulesetName,
    rulesetResult: e.cliByPriority.map(cli => cli.executeOnFiles([projectPath]))
  }))
}
