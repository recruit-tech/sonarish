/* eslint-disable */
module.exports = [
  {
    name: 'meta-comments',
    type: 'eslint',
    eslintOptions: {
      parser: 'babel-eslint',
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
      {
        rule: 'no-warning-comments',
        args: [{ terms: ['todo', 'fixme', 'xxx'], location: 'start' }],
        priority: 4
      }
    ]
  },
  {
    name: 'complexity',
    type: 'eslint',
    eslintOptions: {
      parser: 'babel-eslint',
      plugins: ['mutation', 'filesize']
    },
    scoreRules: [
      {
        rule: 'mutation/no-mutation',
        priority: 1,
        args: [{ exceptions: ['this', 'that', 'global', 'window', 'module'] }]
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
  },
  {
    name: 'best-practice',
    type: 'eslint',
    eslintOptions: {
      parser: 'babel-eslint',
      plugins: ['eslint-comments', 'promise', 'compat', 'deprecate', 'import']
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
      // promise
      // {
      //   rule: 'promise/catch-or-return',
      //   priority: 2
      // },
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
      },
      // ES2015
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
    ]
  }
]
