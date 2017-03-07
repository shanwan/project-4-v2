// looking for spawn errors
(function () {
  var childProcess = require('child_process')
  var oldSpawn = childProcess.spawn
  function mySpawn () {
    console.log('spawn called')
    console.log(arguments)
    var result = oldSpawn.apply(this, arguments)
    return result
  }
  childProcess.spawn = mySpawn
})()

// Importing Node modules and initializing Express
const express = require('express')
const app = express()
const logger = require('morgan')
const config = require('./config/main')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = require('./router')
const socketEvents = require('./socketEvents')

mongoose.Promise = global.Promise
mongoose.connect(config.database)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Setting up basic middleware for all Express requests
app.use(logger('dev')) // Log requests to API using morgan

// Enable CORS from client-side
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

// Start the server
const server = app.listen(config.port)
console.log('Your server is running on port ' + config.port + '.')
const io = require('socket.io').listen(server)
socketEvents(io)
router(app)
