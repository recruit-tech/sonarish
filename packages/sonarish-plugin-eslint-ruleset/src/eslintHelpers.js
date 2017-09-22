/* @flow */
import fs from 'fs'
import path from 'path'
import { CLIEngine } from 'eslint'
import { entries } from './helpers'
import type { EslintOptions, EnvOptions } from './types'

const ESLINT_ERROR = 2

// export function execEslint(cwd: string, targets: string[], opts: any) {
export function exec(
  cwd: string,
  eslintOpts: EslintOptions,
  envOpts: EnvOptions
) {
  const cli = buildEngine(cwd, eslintOpts, envOpts)
  return cli.executeOnFiles(envOpts._ || [])
}

export function buildEngine(
  cwd: string,
  eslintOpts: EslintOptions,
  _envOpts: any
) {
  const ignorePath = path.join(cwd, '.eslintignore')
  const newOpts = {
    ...eslintOpts,
    cwd,
    ignore: true,
    ignorePath: fs.existsSync(ignorePath) ? ignorePath : null,
    ignorePattern: [
      path.join(cwd, 'node_modules'),
      path.join(cwd, '**', 'node_modules'),
      path.join(cwd, 'dist'),
      path.join(cwd, 'public'),
      path.join(cwd, 'out')
    ]
  }
  return new CLIEngine(newOpts)
}

export function getDefaultConfig(cwd: string, envOpts: EnvOptions) {
  const cli = buildEngine(cwd, { cwd }, envOpts)
  try {
    return cli.getConfigForFile('.')
  } catch (e) {
    return {
      rules: {}
    }
  }
}

type eslint$Rules = {
  [string]: number | [number, any]
}

export function buildRuleset(config: {
  eslintOptions: EslintOptions,
  scoreMap: eslint$Rules
}) {
  const additionalRules = entries(config.scoreMap).reduce((acc, [key, i]) => {
    if (typeof i === 'number') {
      return { ...acc, [key]: [ESLINT_ERROR] }
    } else {
      return { ...acc, [key]: [ESLINT_ERROR, i[1]] }
    }
  }, {})

  const rules = { ...additionalRules }

  return {
    eslintOptions: {
      ...config.eslintOptions,
      useEslintrc: false,
      rules
    },
    scoreMap: entries(config.scoreMap).reduce((acc, [rule, args]) => {
      const score = typeof args === 'number' ? args : args[0]
      return { ...acc, [rule]: score }
    }, {})
  }
}
