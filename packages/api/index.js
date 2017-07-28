/* @flow */
import express from 'express'
import repo from './middlewares/repo'
import repoList from './middlewares/repoList'

const server = express()

// cors
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

server.get('/repo/:name', repo)
server.get('/repoList', repoList)
server.listen(3001, err => {
  if (err) throw err
  console.log('> API Ready on http://localhost:3001')
})
