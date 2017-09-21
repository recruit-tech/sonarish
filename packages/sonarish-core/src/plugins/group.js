/* @flow */
import type { Context, Definition } from 'sonarish-types'

export default {
  type: 'group',
  calcScore(ctx: Context, definition: Definition, opts: any) {
    const { pluginInstanceMap } = ctx

    const results = definition.config.rules.map(rule => {
      const plugin = pluginInstanceMap[rule.definition.type]
      const result = plugin.calcScore(ctx, rule.definition, opts)
      return {
        name: rule.name,
        type: plugin.type,
        priority: rule.priority,
        result
      }
    })
    const sumOfPriorities = results.reduce((acc, i) => acc + i.priority, 0)
    const score =
      results.reduce((acc, i) => acc + i.result.score * i.priority, 0) /
      sumOfPriorities
    return {
      score,
      rawResult: {
        score,
        results
      }
    }
  },

  format(ctx: Context, result: any) {
    const formated = result.results
      .map(i => {
        return (
          i.name +
          ' | ' +
          i.result.score +
          ' | ' +
          ctx.pluginInstanceMap[i.type].format(ctx, i.result.rawResult)
        )
      })
      .map(i => '  ' + i)
      .join('\n')

    return `group: ${result.score}\n${formated}\n`
  }
}
