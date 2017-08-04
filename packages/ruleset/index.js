/* eslint-disable */
module.exports = [
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
