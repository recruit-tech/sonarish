#!/usr/bin/env node
/* eslint-disable */
const path = require('path')
const commands = require('../lib/commands')

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
  }
  case 'add': {
    checkRunnable()
    commands.add(SONARISH_PATH, $1)
  }
  case 'gen': {
    checkRunnable()
    commands.gen(SONARISH_PATH)
  }
  case 'sync': {
    checkRunnable()
    commands.sync(SONARISH_PATH)
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
        gen <repo-name>:
          generate eslint result
    `)
  }
}
