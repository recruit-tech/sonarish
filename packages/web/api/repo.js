const path = require('path')
const fs = require('fs')
const { CLIEngine } = require('eslint')

const SONARISH_REPOS_PATH = '/tmp/sonarish-repos'
const ERR = 2

type Ruleset = {
  rulesetName: string,
  plugins?: string[],
  rules: Object
}

type RulesetEngine = {
  rulesetName: string,
  cli: CLIEngine
}

const RULESETS: Ruleset[] = [
  {
    rulesetName: 'code-quality',
    plugins: ['mutation', 'eslint-comments'],
    rulesWithPriority: [
      {
        rule: 'prefer-arrow-callback',
        priority: 1
      },
      {
        rule: 'prefer-const',
        priority: 2
      },
      {
        rule: 'eslint-comments/no-use',
        priority: 3
      },
      {
        rule: 'mutation/no-mutation',
        priority: 0,
        args: [{ exceptions: ['this', 'that', 'global', 'window', 'module'] }]
      }
    ]
  }
]

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

// /repo/:name
module.exports = (req, res) => {
  const { name } = req.params
  const rootPath = path.resolve(SONARISH_REPOS_PATH, name)
  if (!fs.existsSync(rootPath)) {
    return res.send({
      error: true,
      message: `There is no ${name}`
    })
  }
  res.send({
    error: false,
    name,
    data: engines.map(e => ({
      rulesets: RULESETS,
      rulesetName: e.rulesetName,
      rulesetResult: e.cliByPriority.map(cli => cli.executeOnFiles([rootPath]))
    }))
  })
}
