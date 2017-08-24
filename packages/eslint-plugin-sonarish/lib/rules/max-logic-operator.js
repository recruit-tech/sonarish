'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var countOperator = function countOperator(node) {
  switch (node.type) {
    case 'LogicalExpression':
      return 1 + countOperator(node.left) + countOperator(node.right);
    default:
      return 0;
  }
};

exports.default = {
  meta: {
    docs: {},
    schema: [{
      type: 'object',
      properties: {
        max: {
          type: 'number'
        }
      },
      additionalProperties: false
    }]
  },

  create: function create(context) {
    // const options = context.options[0] || {}
    return {
      IfStatement: function IfStatement(node) {
        var logicNum = countOperator(node.test);
        if (logicNum > 2) {
          context.report({
            node: node,
            message: 'Too many logical operator in if statement (> 2)'
          });
        }
      }
    };
  }
};