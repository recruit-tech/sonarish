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
import depHealthPlugin from 'sonarish-plugin-dep-health'
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
  const pluginInstanceMap: any = (plugins || []).reduce(
    (acc, pluginName) => {
      return { ...acc, [pluginName]: _loadPluginInstance(pluginName) }
    },
    {
      group: groupPlugin,
      echo: echoPlugin,
      'eslint-ruleset': eslintRulesetPlugin,
      'dep-health': depHealthPlugin
    }
  )

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

/* eslint-disable */
export function _loadPluginInstance(refName: string): PluginInterface<*> {
  try {
    // $FlowFixMe
    return require('sonarish-plugin-' + refName)
  } catch (_e) {
    // $FlowFixMe
    return require(refName)
  }
}

export function loadPlugin(ctx: Context, refName: string): Context {
  return addPlugin(ctx, _loadPluginInstance(refName))
}
