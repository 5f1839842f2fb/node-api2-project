const express = require('express')
const server = express()

const db = require('./data/db.js')
const postsRoutes = require('./posts/postsRoutes')

server.use(express.json())

server.use('/api/posts', postsRoutes)

server.use('/', (req, res) => {
  res.status(200).send('Hello')
})

server.listen(5000, () => {
  console.log("listening on 5000")
})