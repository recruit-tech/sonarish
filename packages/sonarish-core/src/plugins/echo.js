/* @flow */
import type { Context, PluginInterface, Definition } from 'sonarish-types'

const plugin: PluginInterface<{ score: number, type: 'echo' }> = {
  type: 'echo',
  calcScore(_ctx: Context, definition: Definition, _opts?) {
    return {
      type: 'echo',
      score: definition.config.score,
      rawResult: {
        type: 'echo',
        score: definition.config.score
      }
    }
  },
  format(_ctx, result) {
    return `echo/${result.type}: ${result.score}`
  }
}

export default plugin
