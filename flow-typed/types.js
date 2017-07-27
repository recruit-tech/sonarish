declare module 'sonarish-types' {
  declare type eslint$CLIEngineResult = {
    errorCount: number,
    warningCount: number,
    results: Array<{
      filePath: string,
      errorCount: number,
      warningCount: number,
      messages: Array<{
        source: string,
        ruleId: string,
        message: string,
        line: number,
        column: number
      }>
    }>,
  }

  declare type Ruleset = {
    rulesetName: string,
    presets?: string[],
    plugins?: string[],
    rulesWithPriority: Array<{
      rule: string,
      priority?: number,
      args?: Array<Object>
    }>
  }

  declare type Report = {
    rulesetName: string,
    rulesets: Ruleset[],
    rulesetResult: eslint$CLIEngineResult[]
  }
}
