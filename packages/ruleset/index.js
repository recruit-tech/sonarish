/* eslint-disable */
module.exports = [
  {
    rulesetName: 'code-quality',
    plugins: ['mutation', 'eslint-comments'],
    rulesWithPriority: [
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
