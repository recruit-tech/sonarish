const path = require('path')
const fs = require('fs')
const { CLIEngine } = require('eslint')

const SONARISH_REPOS_PATH = '/tmp/sonarish-repos'
const cli = new CLIEngine({
  useEslintrc: false,
  rules: {
    semi: 2
  }
})

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
  const data = cli.executeOnFiles([rootPath])
  res.send({
    error: false,
    name,
    data
  })
}
