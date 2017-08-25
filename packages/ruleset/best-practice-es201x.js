/* eslint-disable */

const es5 = require('./best-practice-es5')
const originalScoreMap = es5.scoreMap.slice()

module.exports = Object.assign({}, es5, {
  scoreMap: originalScoreMap.concat([
    {
      rule: 'prefer-const',
      priority: 2
    },
    {
      rule: 'prefer-arrow-callback',
      priority: 2
    },
    {
      rule: 'no-return-await',
      priority: 2
    },
    {
      rule: 'no-class-assign',
      priority: 2
    }
  ])
})
