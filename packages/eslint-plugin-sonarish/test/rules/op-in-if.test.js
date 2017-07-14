const rule = require('../../src/rules/op-in-if')
const { RuleTester } = require('eslint')

const ruleTester = new RuleTester({
  parser: 'babel-eslint'
})

ruleTester.run('op-in-if', rule, {
  valid: ['if (a && b && c) {}'],

  invalid: [
    {
      code: 'if (a && b && c && d) {}',
      errors: [{ message: 'Too many logical operator in if statement (> 2)' }]
    }
  ]
})
