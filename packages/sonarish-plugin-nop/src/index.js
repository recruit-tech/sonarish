/* @flow */
/* eslint-disable */

/* This is plugin implementation example*/

export default {
  type: 'nop',
  calcScore(ctx, definition, opts) {
    return {
      type: 'nop',
      score: 0,
      rawResult: {
        message: 'nop'
      }
    }
  },
  format(ctx, result) {
    return `nop ${result.message}`
  }
}
