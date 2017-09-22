/* eslint-disable */
const complexity = {
  eslintOptions: {
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    plugins: ['mutation']
  },
  scoreMap: {
    'mutation/no-mutation': [
      1,
      { exceptions: ['this', 'that', 'global', 'window', 'module'] }
    ],
    complexity: [2, 5],
    'no-unreachable': 4,
    'no-cond-assign': 4,
    'no-func-assign': 3,
    'no-param-reassign': 3,
    'no-shadow': 2,
    'max-lines': [2, { max: 300, skipBlankLines: true }]
  }
}

const bestPractice = {
  eslintOptions: {
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    plugins: ['eslint-comments', 'promise', 'compat', 'import']
  },
  scoreMap: {
    'compat/compat': 1,
    'import/no-extraneous-dependencies': 3,
    'import/no-mutable-exports': 2,
    'promise/no-nesting': 2,
    'promise/always-return': 2,
    'no-unused-vars': [1, { varsIgnorePattern: '^_|React' }],
    'no-multiple-empty-lines': [2, { max: 3 }],
    eqeqeq: [1, 'smart'],
    'no-console': 1,
    'no-ex-assign': 4,
    'no-dupe-keys': 3,
    'no-dupe-args': 3,
    'no-debugger': 2,
    'no-global-assign': [4, { exceptions: ['window'] }],
    'prefer-const': 2,
    'prefer-arrow-callback': 1,
    'no-return-await': 2,
    'no-class-assign': 2
  }
}

const metaComments = {
  eslintOptions: {
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    plugins: ['eslint-comments']
  },
  scoreMap: {
    'eslint-comments/no-use': 1,
    'eslint-comments/no-unused-disable': 1,
    'eslint-comments/no-unused-enable': 1,
    'no-warning-comments': [
      4,
      { terms: ['todo', 'fixme', 'xxx'], location: 'start' }
    ]
  }
}

module.exports = {
  plugin: [],
  scoreMap: {
    complexity: ['eslint-ruleset', 1, complexity],
    'best-practice': ['eslint-ruleset', 1, bestPractice],
    'meta-comments': ['eslint-ruleset', 1, metaComments],
    'dep-health': ['dep-health', 1, {}]
  }
}
