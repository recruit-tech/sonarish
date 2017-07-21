const express = require('express')
const repo = require('./middlewares/repo')

const server = express()

// cors
server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

server.get('/repo/:name', repo)
server.listen(3001, err => {
  if (err) throw err
  console.log('> API Ready on http://localhost:3001')
})
