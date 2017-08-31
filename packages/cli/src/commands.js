/* @flow */
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { CLIEngine } from 'eslint'
import { calcStats, buildEslintRuleset } from 'sonarish-core'
import { loadDatabase, registerRepository, initDatabase } from './storage'
import { gitUrlToName, cloneOrRebase } from './util'

// paths util
export function isRunnable(basePath: string): boolean {
  return !!fs.existsSync(basePath)
}

export function getDbPath(basePath: string): string {
  return path.join(basePath, 'db.json')
}

export function getReposPath(basePath: string): string {
  return path.join(basePath, 'repos')
}

export function getResultsPath(basePath: string): string {
  return path.join(basePath, 'results')
}

// commands
export function ensureWorkspace(basePath: string) {
  const reposPath = getReposPath(basePath)
  const resultsPath = getResultsPath(basePath)
  mkdirp.sync(reposPath)
  mkdirp.sync(resultsPath)
}

export function initWorkspace(basePath: string) {
  ensureWorkspace(basePath)

  const dbPath = getDbPath(basePath)
  initDatabase(dbPath)
  console.log('init with', basePath)
}

export function add(basePath: string, gitUrl: string) {
  const name = gitUrlToName(gitUrl)
  const dbPath = getDbPath(basePath)
  const reposPath = getReposPath(basePath)

  registerRepository(dbPath, gitUrl)
  cloneOrRebase(gitUrl, path.join(reposPath, name))
  console.log('add', gitUrl)
}

// utils
export function buildEslintOnProject(projectRootPath: string, opts: any) {
  const ignorePath = path.join(projectRootPath, '.eslintignore')
  return new CLIEngine({
    ...opts,
    ignore: true,
    ignorePath: fs.existsSync(ignorePath) ? ignorePath : null,
    ignorePattern: [
      path.join(projectRootPath, 'node_modules'),
      path.join(projectRootPath, '**', 'node_modules'),
      path.join(projectRootPath, 'dist'),
      path.join(projectRootPath, 'public'),
      path.join(projectRootPath, 'out')
    ]
  })
}

export function getDefaultEslintConfig(projectRootPath: string, opts: any) {
  const cli = buildEslintOnProject(projectRootPath, opts)
  return cli.getConfigForFile('.')
}

export function execEslintOnProject(
  projectRootPath: string,
  targets: string[],
  opts: any
) {
  const cli = buildEslintOnProject(projectRootPath, opts)
  return cli.executeOnFiles(
    targets.length === 0
      ? [projectRootPath]
      : targets.map(t => path.join(projectRootPath, t))
  )
}

export function buildResultMap(projectRootPath: string, rulesetList: any) {
  return rulesetList.reduce((acc, ruleset) => {
    const { eslintOptions } = buildEslintRuleset(ruleset)
    const r = execEslintOnProject(projectRootPath, [], eslintOptions)
    return { ...acc, [ruleset.name]: r }
  }, {})
}

export function genResultMapFile(basePath: string, rulesetList: any) {
  const dbPath = getDbPath(basePath)
  const db = loadDatabase(dbPath)
  const reposPath = getReposPath(basePath)
  const resultsPath = getResultsPath(basePath)

  db.repos.map(repo => {
    const projectRootPath = path.join(reposPath, repo.name)
    const outPath = path.join(resultsPath, repo.name + '.eslint.json')
    const resultMap = buildResultMap(projectRootPath, rulesetList)
    fs.writeFileSync(outPath, JSON.stringify(resultMap))
    console.log('gen >', outPath)
  })
}

export function genStatsFile(basePath: string, rulesetList: any) {
  const dbPath = getDbPath(basePath)
  const db = loadDatabase(dbPath)
  const resultsPath = getResultsPath(basePath)

  db.repos.forEach(repo => {
    const outPath = path.join(resultsPath, repo.name + '.stats.json')
    const resultMapPath = path.join(resultsPath, repo.name + '.eslint.json')
    const resultMap = JSON.parse(fs.readFileSync(resultMapPath).toString())

    const statsMap = rulesetList.reduce((acc, ruleset) => {
      const rawResult = resultMap[ruleset.name]
      const { scoreMap } = buildEslintRuleset(ruleset)
      const stats = calcStats(rawResult, scoreMap)
      return { ...acc, [ruleset.name]: stats }
    }, {})
    fs.writeFileSync(outPath, JSON.stringify(statsMap))
    console.log('gen >', outPath)
  })
}

export function sync(basePath: string) {
  const dbPath = getDbPath(basePath)
  const db = loadDatabase(dbPath)
  db.repos.map(repo => {
    cloneOrRebase(repo.gitUrl, repo.name)
  })
  console.log('synced')
}
