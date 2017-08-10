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
    name: 'complexity',
    type: 'eslint',
    eslintOptions: {
      parser: 'babel-eslint',
      plugins: ['mutation']
    },
    scoreRules: [
      {
        rule: 'mutation/no-mutation',
        priority: 1,
        args: [{ exceptions: ['this', 'that', 'global', 'window', 'module'] }]
      }
    ]
  },
  {
    name: 'best-practice',
    type: 'eslint',
    eslintOptions: {
      parser: 'babel-eslint',
      plugins: ['eslint-comments', 'promise', 'compat', 'deprecate', 'import']
    },
    scoreRules: [
      // deprecate
      // compat
      {
        rule: 'compat/compat',
        priority: 1
      },
      // import
      {
        rule: 'import/no-extraneous-dependencies',
        priority: 3
      },
      {
        rule: 'import/no-mutable-exports',
        priority: 2
      },
      // promise
      {
        rule: 'promise/catch-or-return',
        priority: 2
      },
      {
        rule: 'promise/no-nesting',
        priority: 2
      },
      {
        rule: 'promise/no-return-wrap',
        priority: 2
      },
      {
        rule: 'promise/always-return',
        priority: 2
      },
      // eslint-comments
      {
        rule: 'eslint-comments/no-use',
        priority: 3
      },
      // eslint
      // {
      //   rule: 'no-undef',
      //   priority: 3,
      //   args: [{ exceptions: ['require', 'module', 'global', 'window'] }]
      // },
      {
        rule: 'no-unused-vars',
        priority: 1,
        args: [{ varsIgnorePattern: '^_|React' }]
      },
      {
        rule: 'no-multiple-empty-lines',
        priority: 2,
        args: [{ max: 3 }]
      },
      {
        rule: 'eqeqeq',
        args: ['smart'],
        priority: 1
      },
      {
        rule: 'no-console',
        priority: 1
      },
      {
        rule: 'no-ex-assign',
        priority: 4
      },
      {
        rule: 'no-dupe-keys',
        priority: 3
      },
      {
        rule: 'no-dupe-args',
        priority: 3
      },
      {
        rule: 'no-debugger',
        priority: 2
      },
      {
        rule: 'no-global-assign',
        priority: 4,
        args: [{ exceptions: ['window'] }]
      },
      // ES2015
      {
        rule: 'prefer-const',
        priority: 2
      },
      {
        rule: 'prefer-arrow-callback',
        priority: 2
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
      ignore: true,
      // ignorePath: '.eslintignore',
      useEslintrc: false,
      rules
    },
    defaultErrorScore: 3,
    defaultWarningScore: 1,
    scoreMap: ruleset.scoreRules.reduce((acc, i) => {
      return { ...acc, [i.rule]: i.priority }
    }, {})
  }
}

export const execEslintOnProject: $execEslintOnProject = (
  projectRootPath,
  opts
) => new CLIEngine(opts).executeOnFiles([projectRootPath])

const norm = (count: number, threshold = 150) => {
  return Math.sqrt(Math.min(count, threshold) / threshold)
}

const values: any = Object.values // TODO: Grasp flow

export const calcStats: $calcStats = (result, scoreMap) => {
  const messages = flatten(result.results.map(r => r.messages))
  const groupedMessages = groupBy(messages, m => m.ruleId)
  const rules = Object.keys(groupedMessages).filter(i => !!i && i !== 'null')
  const sumOfPriorities = values(scoreMap).reduce((sum, i) => sum + i, 0)

  // console.log('sumOfPriorities', sumOfPriorities, scoreMap)

  const scoresByRule = rules
    .map(rule => {
      const count = groupedMessages[rule].length
      const priority = scoreMap[rule]
      const weight = priority / sumOfPriorities
      const point = norm(count) * weight
      console.log('----', { weight, sumOfPriorities, count, point })
      return {
        [rule]: {
          count,
          priority,
          weight,
          point
        }
      }
    })
    .reduce((acc, r) => ({ ...acc, ...r }), {})

  const totalScore = values(scoresByRule).reduce(
    (sum: number, i) => sum + i.point,
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
      name: ruleset.name,
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
