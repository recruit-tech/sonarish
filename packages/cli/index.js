/* eslint-disable */
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const { execSync } = require('child_process')
const mkdirp = require('mkdirp')
const sonarish = require('sonarish-core')

const argv = require('minimist')(process.argv.slice(2))
const { gitUrlToName, cloneOrRebase } = require('./util')
const { loadDb, registerRepo, initDb } = require('./storage')

const [cmd] = argv._

const sonarishPath = argv.path || path.join(process.env.HOME, '.sonarish')
const repoDirPath = path.join(sonarishPath, 'repos')
const resultDirPath = path.join(sonarishPath, 'results')
const dbPath = path.join(sonarishPath, 'db.json')
console.log(sonarishPath)

switch (cmd) {
  case 'init': {
    if (fs.existsSync(sonarishPath)) {
      console.warn('already exists', sonarishPath)
      process.exit(1)
    }
    mkdirp.sync(path.join(sonarishPath, 'repos'))
    mkdirp.sync(path.join(sonarishPath, 'results'))
    initDb(dbPath)
    console.log('init with', sonarishPath)
    break
  }
  case 'add': {
    const [_, gitUrl] = argv._
    if (!fs.existsSync(sonarishPath)) {
      console.error('You need to run `sonarish init` first')
    }

    registerRepo(dbPath, gitUrl)
    cloneOrRebase(gitUrl, path.join(repoDirPath, name))
    console.log('add', db)
    break
  }
  case 'sync': {
    const db = loadDb(dbPath)
    db.repos.map(repo => {
      cloneOrRebase(repo.gitUrl, repo.name)
    })
    console.log('synced')
    break
    // console.log('sync')
  }
  case 'gen': {
    const db = loadDb(dbPath)
    db.repos.map(repo => {
      const repoPath = path.join(repoDirPath, repo.name)
      const result = sonarish.report(repoPath)
      const resultPath = path.join(resultDirPath, repo.name + '.json')
      fs.writeFileSync(resultPath, JSON.stringify(result))
      console.log('gen >', resultPath)
    })
    break
  }
  default: {
    console.log(`Sonarish Commands: init gen show add sync`)
  }
}
// console.log(report('/tmp/sonarish/repos/express'))
