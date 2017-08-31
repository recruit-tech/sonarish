/* eslint-disable */

const es5 = require('./best-practice-es5')

module.exports = Object.assign({}, es5, {
  scoreRules: es5.scoreRules.concat([
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
