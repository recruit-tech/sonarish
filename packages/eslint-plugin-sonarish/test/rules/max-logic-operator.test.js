/* @flow */
import { RuleTester } from 'eslint'
import rule from '../../src/rules/max-logic-operator'

const ruleTester = new RuleTester({
  parser: 'babel-eslint'
})

ruleTester.run('max-logic-operator', rule, {
  valid: ['if (a && b && c) {}'],

  invalid: [
    {
      code: 'if (a && b && c && d) {}',
      errors: [{ message: 'Too many logical operator in if statement (> 2)' }]
    }
  ]
})
