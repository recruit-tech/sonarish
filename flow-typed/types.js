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

  // Domain
  declare type Stats = {
    totalScore: number,
    scoresByRule: {[string]: {
      count: number,
      point: number,
      priority: number,
      weight: number,
    }}
  }

  declare type RulesetReport = {
    type: 'eslint',
    eslintRuleset: EslintRuleset,
    eslintRawResult: eslint$CLIEngineResult,
    stats: Stats
  }

  declare type Ruleset = EslintRuleset

  declare type EslintRuleset = {
    name: string,
    type: 'eslint', // TODO: Add other types
    eslintOptions: eslint$CLIEngineOptions,
    defaultErrorScore?: number,
    defaultWarningScore?: number,
    scoreRules: Array<{
      rule: string,
      args?: Array<*>,
      priority: $Priority
    }>
  }

  declare type EslintRulesetInternal = {
    name: string,
    eslintOptions: eslint$CLIEngineOptions,
    defaultErrorScore: number,
    defaultWarningScore: number,
    scoreMap: { [rule: string]: $Priority }
  }

  // API
  declare type $buildEslintRuleset = (EslintRuleset, ?eslint$CLIEngineOptions) => EslintRulesetInternal

  declare type $execEslintOnProject = (
    string,
    eslint$CLIEngineOptions
  ) => eslint$CLIEngineResult

  declare type $calcStats = (
    result: eslint$CLIEngineResult,
    scoreMap: { [rule: string]: $Priority }
  ) => Stats

  declare type $report = (
    projectRootPath: string,
    opts?: Object
  ) => RulesetReport[]
}
