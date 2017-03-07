require('dotenv').config({ silent: true })

module.exports = {
  // Secret key for JWT signing and encryption
  'secret': process.env.JWT_SECRET,
  // Database connection information
  'database': 'mongodb://localhost/chatertain',
  // Setting port for server
  'port': process.env.PORT || 3000
}
