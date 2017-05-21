var dbUsername = 'root'
var dbPassword = 'pass'
var dnName = 'dmcoderepo'

module.exports = {
  // Server Listening port
  ServerPort: 3000,
  // Email Configuration
  emailConfig: {
    service: 'gmail',
    auth: {
      user: 'digital.testdm@gmail.com',
      pass: 'sag@digital123'
    }
  },
  // Site Email address
  email: '"DM" <digital.testdm@gmail.com>',
  // Database connection configuration
  db: {
    host: 'localhost',
    user: dbUsername,
    password: dbPassword,
    port: 3306,
    database: dnName
  },
  // ORM Configuration
  orm: {
    db: dnName,
    user: dbUsername,
    password: dbPassword
  },
  // Session configuration
  session: {
    secret: 'pass',
    resave: true,
    saveUninitialized: true
  },
  // Remember Me Interval in milliseconds
  rememberMeInterval: 30 * 24 * 60 * 60 * 1000, // 30 days
  // Forgot password token expiry in milliseconds
  forgotPasswordTokenExpiry: 3600000, // 1 hour
  // Password Encryption Config
  passwordSaltRounds: 10
}

