declare module 'sonarish-types' {
  // Constants
  declare type $Trivial = 0
  declare type $Warning = 1
  declare type $Notable = 2
  declare type $Error = 3
  declare type $MustFix = 4

  declare type $Priority = number

  // Internal usage of Eslint
  declare type eslint$ResultMessage = {
    source: string,
    ruleId: string,
    message: string,
    line: number,
    column: number
  }

  declare type eslint$FileScopeResult = {
    filePath: string,
    errorCount: number,
    warningCount: number,
    messages: Array<eslint$ResultMessage>
  }

  declare type eslint$CLIEngineResult = {
    errorCount: number,
    warningCount: number,
    results: Array<eslint$FileScopeResult>
  }

  declare type eslint$CLIEngineOptions = {
    useEslintrc?: boolean,
    parser?: any,
    presets?: Array<*>,
    plugins?: Array<*>,
    rules?: Object
  }

  // New
  declare type CalculationResult<T> = {
    score: number,
    rawResult: T
  }

  declare type PluginInterface<T = void> = {
    type: string,
    calcScore: (Context, Definition, Options) => CalculationResult<T>,
    format: (Context, T) => string
  }

  declare type RootConfig = ContextOptions & {
    definition: Definition
  }

  declare type ContextOptions = {
    plugins?: string[]
  }

  declare type Context = {
    pluginInstanceMap: { [string]: PluginInterface<*> }
  }

  // from minimist
  declare type Options = {
    _?: string[]
  }

  declare type ScoreRule = {
    name?: string,
    type: string,
    priority: number,
    config: any
  }

  declare type Definition = {
    type: string,
    config: any
  }

  declare type EslintRulesetDefinition = {
    type: 'eslint-ruleset',
    config: {
      eslintOptions?: {
        parser?: string,
        parserOptions?: {
          sourceType?: string
        },
        plugins?: string[]
      },
      scoreRules: [
        {
          rule: 'my-rule-1',
          priority: 1
        }
      ]
    }
  }
}
