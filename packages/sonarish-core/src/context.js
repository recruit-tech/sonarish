/* @flow */
import type {
  Context,
  RootConfig,
  ContextOptions,
  Options,
  PluginInterface,
  Definition
} from 'sonarish-types'
import eslintRulesetPlugin from 'sonarish-plugin-eslint-ruleset'
import groupPlugin from './plugins/group'
import echoPlugin from './plugins/echo'

// entry point from cli
export default (rootConfig: RootConfig, opts: Options) => {
  const ctx = createContext(rootConfig, opts)
  return run(ctx, rootConfig.definition, opts)
}

export function createContext(
  { plugins }: ContextOptions = {},
  _opts: Options = {}
): Context {
  const pluginInstanceMap = (plugins || []).reduce((acc, _plug) => {
    // TODO: Load external instance
    return acc
  }, {
    group: groupPlugin,
    echo: echoPlugin,
    'eslint-ruleset': eslintRulesetPlugin
  })

  return {
    pluginInstanceMap
  }
}

export function run(ctx: Context, definition: Definition, opts: Options = {}) {
  const plugin = ctx.pluginInstanceMap[definition.type]
  return plugin.calcScore(ctx, definition, opts)
}

export function format(ctx: Context, type: string, result: any) {
  const plugin = ctx.pluginInstanceMap[type]
  return plugin.format(ctx, result)
}

export function addPlugin(ctx: Context, plugin: PluginInterface<*>): Context {
  return {
    ...ctx,
    pluginInstanceMap: { ...ctx.pluginInstanceMap, [plugin.type]: plugin }
  }
}
