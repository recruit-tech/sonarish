/* @flow */
import fs from 'fs'
import path from 'path'
import { CLIEngine } from 'eslint'
import { entries } from './helpers'

const ESLINT_ERROR = 2

export function execEslint(cwd: string, targets: string[], opts: any) {
  const cli = buildEslintEngine(cwd, opts)
  return cli.executeOnFiles(
    targets.length === 0 ? [cwd] : targets.map(t => path.join(cwd, t))
  )
}

export function buildEslintEngine(cwd: string, opts: any) {
  const ignorePath = path.join(cwd, '.eslintignore')
  return new CLIEngine({
    ...opts,
    ignore: true,
    ignorePath: fs.existsSync(ignorePath) ? ignorePath : null,
    ignorePattern: [
      path.join(cwd, 'node_modules'),
      path.join(cwd, '**', 'node_modules'),
      path.join(cwd, 'dist'),
      path.join(cwd, 'public'),
      path.join(cwd, 'out')
    ]
  })
}

export function getDefaultEslintConfig(cwd: string, opts: any) {
  const cli = buildEslintEngine(cwd, opts)
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

export function buildEslintRuleset(config: {
  eslintOptions: any,
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
