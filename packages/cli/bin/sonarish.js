#!/usr/bin/env node
/* eslint-disable */
const path = require('path')
const commands = require('../lib/commands')

const argv = require('minimist')(process.argv.slice(2))

const [$0] = argv._

const tmpWorkspacePath = '/tmp/sonarish'

if ($0) {
  const ret = commands.execEslintOnProject($0, {
    useEslintrc: true,
    parser: 'babel-eslint'
  })

  console.log('TODO: calcStats', ret)
} else {
  console.log(`sonarish <path> [--scoreRules <sonarishrc-path>] [--no-default-rules]
  `)
}
