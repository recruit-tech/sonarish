/* @flow */
import fs from 'fs'
import { gitUrlToName } from './util'

type Repository = {
  name: string,
  gitUrl: string,
  overridenScoreMap: { [string]: number }
}

export function initDb(dbPath: string) {
  fs.writeFileSync(dbPath, JSON.stringify({ repos: [] }))
}

export function loadDb(dbPath: string): { repos: Repository[] } {
  return JSON.parse(fs.readFileSync(dbPath).toString())
}

export function registerRepository(dbPath: string, gitUrl: string): void {
  const db = loadDb(dbPath)
  const name = gitUrlToName(gitUrl)
  if (db.repos.find(r => r.name === name)) {
    console.warn(name, 'already registered')
    return
  }
  db.repos.push({
    name,
    gitUrl,
    overridenScoreMap: {}
  })
  fs.writeFileSync(dbPath, JSON.stringify(db))
}

export function updateScoreMap(
  dbPath: string,
  name: string,
  diff: { [string]: number }
): void {
  const db = loadDb(dbPath)
  const index = db.repos.findIndex(r => r.name === name)
  if (index < 0) {
    console.warn(name, 'does not exist')
    return
  }

  // mutation
  const repo = db.repos[index]
  db.repos[index] = {
    ...repo,
    overridenScoreMap: { ...repo.overridenScoreMap, ...diff }
  }
  fs.writeFileSync(dbPath, JSON.stringify(db))
}
