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
  const db = loadDb()
  const name = gitUrlToName(gitUrl)
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
  loadDb, registerRepo
}
