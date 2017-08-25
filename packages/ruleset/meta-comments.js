/* eslint-disable */
module.exports = {
  name: 'meta-comments',
  type: 'eslint',
  eslintOptions: {
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    plugins: ['eslint-comments']
  },
  scoreRules: [
    // eslint-comments
    {
      rule: 'eslint-comments/no-use',
      priority: 1
    },
    {
      rule: 'eslint-comments/no-unused-disable',
      priority: 1
    },
    {
      rule: 'eslint-comments/no-unused-enable',
      priority: 1
    },
    // eslint
    {
      rule: 'no-warning-comments',
      args: [{ terms: ['todo', 'fixme', 'xxx'], location: 'start' }],
      priority: 4
    }
  ]
}
