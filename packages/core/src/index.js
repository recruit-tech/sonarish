/* @flow */
import { CLIEngine } from 'eslint'
import flatten from 'lodash.flatten'
import groupBy from 'lodash.groupby'
import type {
  EslintRuleset,
  $report,
  $calcStats,
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

const MAX_CONSIDERING_ERROR = 30
const calc = (count: number) => {
  return Math.sqrt(
    Math.min(count, MAX_CONSIDERING_ERROR) / MAX_CONSIDERING_ERROR
  )
}

export const calcStats: $calcStats = (result, scoreMap) => {
  const messages = flatten(result.results.map(r => r.messages))
  const groupedMessages = groupBy(messages, m => m.ruleId)
  const rules = Object.keys(groupedMessages).filter(i => !!i && i !== 'null')

  const scoresByRule = rules
    .map(rule => {
      const count = groupedMessages[rule].length
      const priority = scoreMap[rule]
      return {
        [rule]: priority * calc(count)
      }
    })
    .reduce((acc, r) => ({ ...acc, ...r }), {})

  const values: any = Object.values // TODO: Grasp flow
  const totalScore = values(scoresByRule).reduce(
    (sum: number, i: number) => sum + i,
    0
  )

  return {
    totalScore,
    scoresByRule
  }
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
    const stats = calcStats(eslintRawResult, rulesetInternal.scoreMap)
    return {
      name: 'code-quality',
      type: 'eslint',
      eslintRuleset: ruleset,
      eslintRawResult,
      stats
    }
  })
}

// debug
// const ret = report('/Users/uu110013/.sonarish/repos/express')
// const eslintResult = ret[0].eslintRawResult
// const messages = flatten(eslintResult.results.map(r => r.messages))
// const groupedMessages = groupBy(messages, m => m.ruleId)
//
// const rules = Object.keys(groupedMessages)
// const scoreMap = buildEslintRuleset(rulesetList[0]).scoreMap
// rules.map(rule => {
//   const count = groupedMessages[rule].length
//   console.log(rule, count, scoreMap[rule])
// })
