/* @flow */
import flatten from 'lodash.flatten'
import groupBy from 'lodash.groupby'
import type { $report, $calcStats, $buildEslintRuleset } from 'sonarish-types'

const ERR = 2

// TODO: Merge with project eslint
export const buildEslintRuleset: $buildEslintRuleset = ruleset => {
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

const norm = (count: number, threshold = 150) => {
  return Math.sqrt(Math.min(count, threshold) / threshold)
}

const values: any = Object.values // TODO: Grasp flow

export const calcStats: $calcStats = (result, scoreMap) => {
  const messages = flatten(result.results.map(r => r.messages))
  const groupedMessages = groupBy(messages, m => m.ruleId)
  const rules = Object.keys(groupedMessages).filter(i => !!i && i !== 'null')
  const sumOfPriorities = values(scoreMap).reduce((sum, i) => sum + i, 0)

  const scoresByRule = rules
    .map(rule => {
      const count = groupedMessages[rule].length
      const priority = scoreMap[rule]
      const weight = priority / sumOfPriorities
      const point = norm(count) * weight
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

// export const reportStats = (eslintRawResult: any, scoreMap: any) => {
//   const stats = calcStats(eslintRawResult, scoreMap)
//   return stats
// }

export const report: $report = (projectRootPath, _opts) => {
  // TODO: use project's eslint file
  // const projectEslintrc = fs.readFileSync(projectRootPath)
  return rulesetList.map(ruleset => {
    const rulesetInternal = buildEslintRuleset(ruleset)
    // const eslintRawResult = execEslintOnProject(
    //   projectRootPath,
    //   rulesetInternal.eslintOptions
    // )
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
