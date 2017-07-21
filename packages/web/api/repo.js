const path = require('path')
const fs = require('fs')
const { report } = require('sonarish-core')

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
    data: report(rootPath)
  })
}
