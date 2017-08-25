/* eslint-disable */
module.exports = {
  name: 'best-practice',
  type: 'eslint',
  eslintOptions: {
    parser: 'babel-eslint',
    plugins: ['eslint-comments', 'promise', 'compat', 'import']
  },
  scoreRules: [
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
    // eslint
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
    }
  ]
}
