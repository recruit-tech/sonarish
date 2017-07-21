const countOperator = node => {
  switch (node.type) {
    case 'LogicalExpression':
      return 1 + countOperator(node.left) + countOperator(node.right)
    default:
      return 0
  }
}

export default {
  meta: {
    docs: {},
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'number'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    // const options = context.options[0] || {}
    return {
      IfStatement(node) {
        const logicNum = countOperator(node.test)
        if (logicNum > 2) {
          context.report({
            node,
            message: 'Too many logical operator in if statement (> 2)'
          })
        }
      }
    }
  }
}
