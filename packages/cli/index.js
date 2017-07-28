#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const mkdirp = require('mkdirp')
const sonarish = require('sonarish-core')
const { gitUrlToName, cloneOrRebase } = require('./util')
const { loadDb, registerRepo, initDb } = require('./storage')

// cli parser
const argv = require('minimist')(process.argv.slice(2))
const [ $0, $1 ] = argv._

// constants
const SONARISH_PATH = argv.path || path.join(process.env.HOME, '.sonarish')
const REPO_DIR_PATH = path.join(SONARISH_PATH, 'repos')
const RESULT_DIR_PATH = path.join(SONARISH_PATH, 'results')
const DB_PATH = path.join(SONARISH_PATH, 'db.json')

function isRunnable() {
  return !!fs.existsSync(SONARISH_PATH)
}

switch ($0) {
  case 'init': {
    if (fs.existsSync(SONARISH_PATH)) {
      console.warn('already exists', SONARISH_PATH)
      process.exit(1)
    }
    mkdirp.sync(REPO_DIR_PATH)
    mkdirp.sync(RESULT_DIR_PATH)
    initDb(DB_PATH)
    console.log('init with', SONARISH_PATH)
    break
  }
  case 'add': {
    if (!isRunnable()) {
      console.error('You need to run `sonarish init` first')
      process.exit(1)
    }

    const gitUrl = $1
    const name = gitUrlToName(gitUrl)

    registerRepo(DB_PATH, gitUrl)
    cloneOrRebase(gitUrl, path.join(REPO_DIR_PATH, name))
    console.log('add', $1)
    break
  }
  case 'gen': {
    if (!isRunnable()) {
      console.error('You need to run `sonarish init` first')
      process.exit(1)
    }

    const db = loadDb(DB_PATH)
    db.repos.map(repo => {
      const repoPath = path.join(REPO_DIR_PATH, repo.name)
      const result = sonarish.report(repoPath)
      const resultPath = path.join(RESULT_DIR_PATH, repo.name + '.json')
      fs.writeFileSync(resultPath, JSON.stringify(result))
      console.log('gen >', resultPath)
    })
    break
  }
  case 'sync': {
    if (!isRunnable()) {
      console.error('You need to run `sonarish init` first')
      process.exit(1)
    }

    const db = loadDb(DB_PATH)
    db.repos.map(repo => {
      cloneOrRebase(repo.gitUrl, repo.name)
    })
    console.log('synced')
    break
  }
  default: {
    console.log(`Sonarish Commands: init add gen sync`)
  }
}
