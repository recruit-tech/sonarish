/* @flow */
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { CLIEngine } from 'eslint'
// const sonarish = require('sonarish-core')
import { gitUrlToName, cloneOrRebase } from './util'
import { loadDb, registerRepository, initDb } from './storage'

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
  initDb(dbPath)
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

export function execEslintOnProject(projectRootPath: string, opts: any) {
  return new CLIEngine(opts).executeOnFiles([projectRootPath])
}

export function genEslintResult(
  projectRootPath: string,
  opts: any,
  outPath: string
) {
  const result = execEslintOnProject(projectRootPath, opts)
  fs.writeFileSync(outPath, JSON.stringify(result))
}

export function genResults(basePath: string) {
  const dbPath = getDbPath(basePath)
  const db = loadDb(dbPath)
  const reposPath = getReposPath(basePath)
  const resultsPath = getResultsPath(basePath)

  db.repos.map(repo => {
    const projectRootPath = path.join(reposPath, repo.name)
    const outPath = path.join(resultsPath, repo.name + '.eslint.json')
    genEslintResult(projectRootPath, {}, outPath)
    console.log('gen >', outPath)
  })
}

export function sync(basePath: string) {
  const dbPath = getDbPath(basePath)
  const db = loadDb(dbPath)
  db.repos.map(repo => {
    cloneOrRebase(repo.gitUrl, repo.name)
  })
  console.log('synced')
}
