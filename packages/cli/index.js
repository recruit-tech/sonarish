/* eslint-disable */
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const sonarish = require('sonarish-core')
const argv = require('minimist')(process.argv.slice(2))

const [cmd] = argv._

const sonarishPath = argv.path || path.resolve('~/.sonarish')

switch (cmd) {
  case 'init':
    mkdirp.sync(path.join(sonarishPath, 'repos'))
    mkdirp.sync(path.join(sonarishPath, 'results'))
    fs.writeFileSync(
      path.join(sonarishPath, 'db.json'),
      JSON.stringify({ repos: [] })
    )
    console.log('init with', sonarishPath)
    break
  case 'add':
    const [_, gitUrl] = argv._
    if (!fs.existsSync(sonarishPath)) {
      console.error('You need to run `sonarish init` first')
    }
    console.log('init with', sonarishPath)
    break
  case 'gen':
    console.log(sonarishPath)
    const repoDirPath = path.join(sonarishPath, 'repos')
    const resultDirPath = path.join(sonarishPath, 'results')
    const repoNames = fs.readdirSync(repoDirPath)
    repoNames.map(repoName => {
      const repoPath = path.join(repoDirPath, repoName)
      const result = sonarish.report(repoPath)

      const resultPath = path.join(resultDirPath, repoName)
      fs.writeFileSync(resultPath, JSON.stringify(result))
      console.log('gen', resultPath)
    })
    break
  default:
    console.log(`Sonarish Commands: gen show`)
}
// console.log(report('/tmp/sonarish/repos/express'))
