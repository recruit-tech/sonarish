/* eslint-disable */
module.exports = {
  name: 'complexity',
  type: 'eslint',
  eslintOptions: {
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    plugins: ['mutation']
  },
  scoreRules: [
    {
      rule: 'mutation/no-mutation',
      args: [{ exceptions: ['this', 'that', 'global', 'window', 'module'] }],
      priority: 1
    },
    {
      rule: 'no-unreachable',
      priority: 4
    },
    {
      rule: 'no-cond-assign',
      priority: 4
    },
    {
      rule: 'no-func-assign',
      priority: 3
    },
    {
      rule: 'no-param-reassign',
      priority: 3
    },
    {
      rule: 'no-shadow',
      priority: 2
    },
    {
      rule: 'max-lines',
      args: [{ max: 300, skipBlankLines: true }],
      priority: 2
    }
  ]
}
