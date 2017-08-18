/* eslint-disable */
const fs = require('fs')
const { gitUrlToName } = require('./util')

function initDb(dbPath) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ repos: [] })
  )
}

function loadDb(dbPath) {
  return require(dbPath)
}

function registerRepo(dbPath, gitUrl) {
  const db = loadDb(dbPath)
  const name = gitUrlToName(gitUrl)
  if (db.repos.find(r => r.name === name)) {
    console.warn(name, 'already registered')
    return
  }
  db.repos.push({
    name,
    gitUrl
  })
  fs.writeFileSync(
    dbPath,
    JSON.stringify(db)
  )
}

module.exports = {
  initDb, loadDb, registerRepo
}
