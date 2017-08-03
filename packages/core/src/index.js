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
      parser: 'babel-eslint',
      plugins: ['mutation', 'eslint-comments']
    },
    scoreRules: [
      {
        rule: 'mutation/no-mutation',
        priority: 0,
        args: [{ exceptions: ['this', 'that', 'global', 'window', 'module'] }]
      },
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
      }
    ]
  }
]

// TODO: Merge with project eslint
export const buildEslintRuleset: $buildEslintRuleset = (
  ruleset,
  _projectEslintrc // TODO: Use project default eslintrc
) => {
  const additionalRules = ruleset.scoreRules.reduce((acc, i) => {
    return { ...acc, [i.rule]: [ERR, ...(i.args || [])] }
  }, {})
  const defaultRules = ruleset.eslintOptions.rules || {}
  const rules = { ...defaultRules, ...additionalRules }

  return {
    name: ruleset.name,
    eslintOptions: {
      ...ruleset.eslintOptions,
      useEslintrc: false,
      rules
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
  // TODO: use project's eslint file
  // const projectEslintrc = fs.readFileSync(projectRootPath)
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

console.log(report('/Users/uu110013/.sonarish/repos/express'))
