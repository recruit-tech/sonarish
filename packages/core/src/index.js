/* @flow */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import { CLIEngine } from 'eslint'
import type {
  EslintRuleset,
  $report,
  $calcScore,
  $execEslintOnProject,
  $buildEslintRuleset
} from 'sonarish-types'

const ERR = 2

const rulesetList: EslintRuleset[] = [
  {
    name: 'code-quality',
    type: 'eslint',
    eslintOptions: {
      useEslintrc: false,
      parser: 'babel-eslint',
      plugins: ['mutation', 'eslint-comments']
    },
    scoreRules: [
      {
        rule: 'prefer-arrow-callback',
        priority: 1
      },
      {
        rule: 'prefer-const',
        priority: 2
      },
      {
        rule: 'eslint-comments/no-use',
        priority: 3
      },
      {
        rule: 'mutation/no-mutation',
        priority: 0,
        args: [{ exceptions: ['this', 'that', 'global', 'window', 'module'] }]
      }
    ]
  }
]

export const buildEslintRuleset: $buildEslintRuleset = ruleset => {
  return {
    name: ruleset.name,
    eslintOptions: {
      ...ruleset.eslintOptions,
      useEslintrc: ruleset.eslintOptions.useEslintrc || true,
      // TODO: Override by defaults
      rules: ruleset.scoreRules.reduce((acc, i) => {
        return { ...acc, [i.rule]: [ERR, i.args || []] }
      }, {})
    },
    defaultErrorScore: 1,
    defaultWarningScore: 3,
    scoreMap: ruleset.scoreRules.reduce((acc, i) => {
      return { ...acc, [i.rule]: i.priority }
    }, {})
  }
}

export const execEslintOnProject: $execEslintOnProject = (
  projectRootPath,
  opts
) => new CLIEngine(opts).executeOnFiles([projectRootPath])

export const calcScore: $calcScore = (_result, _scoreMap) => {
  return 0
}

export const report: $report = (projectRootPath, _opts) => {
  return rulesetList.map(ruleset => {
    const rulesetInternal = buildEslintRuleset(ruleset)
    const eslintRawResult = execEslintOnProject(
      projectRootPath,
      rulesetInternal.eslintOptions
    )
    const score = calcScore(eslintRawResult, rulesetInternal.scoreMap)
    return {
      name: 'code-quality',
      type: 'eslint',
      eslintRuleset: ruleset,
      eslintRawResult,
      score
    }
  })
}
