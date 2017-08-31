#!/usr/bin/env node
import path from 'path'
import rulesetList from 'sonarish-ruleset/es201x'
import * as commands from './commands'

const argv = require('minimist')(process.argv.slice(2))

const [$0, $1] = argv._

const SONARISH_PATH = argv.path || path.join(process.env.HOME, '.sonarish')

const checkRunnable = () => {
  if (!commands.isRunnable(SONARISH_PATH)) {
    console.error('You need to run `sonarish init` first')
    process.exit(1)
  }
}

switch ($0) {
  case 'init': {
    commands.initWorkspace(SONARISH_PATH)
    break
  }
  case 'add': {
    checkRunnable()
    commands.add(SONARISH_PATH, $1)
    break
  }
  case 'gen-stats': {
    checkRunnable()
    commands.genResultMapFile(SONARISH_PATH, rulesetList)
    commands.genStatsFile(SONARISH_PATH, rulesetList)
    break
  }
  case 'sync': {
    checkRunnable()
    commands.sync(SONARISH_PATH)
    break
  }
  default: {
    console.log(`sonarish-server

  usages:
    init [--path <path>]
      create sonarish project base
    add <git-url>:
      create sonarish project base
    sync <repo-name>:
      update added repositories
    gen-stats <repo-name>:
      generate eslint result
    `)
  }
}
