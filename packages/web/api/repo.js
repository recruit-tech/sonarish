const path = require('path')
const fs = require('fs')
const { CLIEngine } = require('eslint')

const SONARISH_REPOS_PATH = '/tmp/sonarish-repos'
const ERR = 2

const RULESETS = [
  {
    rulesetName: 'style',
    rules: { semi: ERR }
  },
  {
    rulesetName: 'quality',
    rules: { 'prefer-const': ERR }
  }
]

const engines = RULESETS.map(r => ({
  rulesetName: r.rulesetName,
  cli: new CLIEngine({
    useEslintrc: false,
    rules: r.rules
  })
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
      rulesetName: e.rulesetName,
      rulesetResult: e.cli.executeOnFiles([rootPath])
    }))
  })
}
