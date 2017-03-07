const AuthenticationController = require('./controllers/authentication')
// const UserController = require('./controllers/user')
const ChatController = require('./controllers/chat')
const express = require('express')
// const passportService =
require('./config/passport')
const passport = require('passport')

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = passport.authenticate('local', { session: false })

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router()
  const authRoutes = express.Router()
  const chatRoutes = express.Router()

  // =========================
  // Auth Routes
  // =========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes)

  // Registration route
  apiRoutes.post('/register', AuthenticationController.register)

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login)

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/chat', chatRoutes)

  // View messages to and from authenticated user
  chatRoutes.get('/', requireAuth, ChatController.getConversations)

  // Retrieve single conversation
  chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation)

  // Send reply in conversation
  chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply)

  // Start new conversation
  chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation)

  // Set url for API group routes
  app.use('/api', apiRoutes)
}
