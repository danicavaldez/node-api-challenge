const express = require('express')

const server = express()

const projectRouter = require('./routers/project-router')
const actionRouter = require('./routers/action-router')

server.use(express.json())

server.use('/projects', projectRouter)
server.use('/projects', actionRouter)

server.get('/', (req, res) => {
  res.send('Node API Sprint Challenge!')
})

module.exports = server;