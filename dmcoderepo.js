/**
 * dmcoderepo.js
 *
 * Application Configuration file
 */

// Including extra Packages
// Express Framework
var express = require('express')
// Mysql Driver
var mysql = require('mysql')
// Mysql Driver Helper
var connection = require('express-myconnection')
// Path creation helper
var path = require('path')
// File read and write helper
var fs = require('fs')
// Cookie data parser
var cookieParser = require('cookie-parser')
// Session Helper
var session = require('express-session')
// HTTP POST data parser
var bodyParser = require('body-parser')
// CSRF helper
var csrf = require('csurf')
// Authenication helper
var passport = require('passport')
// Local Authenication helper
var LocalStrategy = require('passport-local')
// File upload helper
var expressFileUpload = require('express-fileupload')
// Password encryption helper
var bcrypt = require('bcrypt')
// ORM
var Sequelize = require('sequelize')
// RBAC Helper
var Acl = require('acl')
// RBAC database helper
var AclSeq = require('acl-sequelize')
// HTTP header protection
var helmet = require('helmet')
// To show flash messages
var flash = require('connect-flash')
// Gets application configurations
var config = require('./lib/config')

// ======================== Basic Configurations =============================
// Creating express object
var app = express()

// Adding csrf middleware to the application
var csrfProtection = csrf({ cookie: true })
app.locals.csrfProtection = csrfProtection

// Adding body parser middleware to the application
var parseForm = bodyParser.urlencoded({ extended: false })
app.locals.parseForm = parseForm
app.use(parseForm)

// Adding file upload middleware to application
app.use(expressFileUpload())

// Helmets middleware added to secure app
// by setting various HTTP headers
app.use(helmet())

// Setting Loggers
var logger = require('./lib/logger')
app.locals.logger = logger
app.use(require('morgan')('combined', { 'stream': logger.stream }))

// Sets View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Adding static middleware to the application
// Static middleware is used to serve css, js and images files.
app.use(express.static(path.join(__dirname, 'public')))

// Adding express mysql middleware to the application
app.use(connection(mysql, config.db))

// Adding session management middleware to the application
app.use(session(config.session))

// Adding cookie management middleware to the application
app.use(cookieParser('pass'))

// Adding flash message middleware to the application
app.use(flash())
app.use(function (req, res, next) {
  // if there's a flash message, transfer
  // it to the context, then clear it
  res.locals.flash = req.session.flash

  if (req.session.flash) {
    delete req.session.flash
  }
  next()
})

var flashHelper = require('./lib/flashHelper')
app.locals.flashHelper = flashHelper

// ======================== ORM Configuration ================================
var ormConnection = new Sequelize(
    config.orm.db,
    config.orm.user,
    config.orm.password, {
      logging: false // Disables console logging queries
    }
)

app.locals.sequelize = ormConnection

var Subdomain = require('./models/orm/Subdomain')(Sequelize, ormConnection)
app.locals.Subdomain = Subdomain

var Codebase = require('./models/orm/Codebase')(Sequelize, ormConnection)
app.locals.Codebase = Codebase

var Domain = require('./models/orm/Domain')(Sequelize, ormConnection)
app.locals.Domain = Domain

var User = require('./models/orm/User')(Sequelize, ormConnection)
app.locals.User = User

// ======================== RBAC Configuring using ORM ========================
var acl = new Acl(new AclSeq(ormConnection, { prefix: 'acl_' }))
app.locals.acl = acl

// ======================== Authorization Configuration ======================

// Configuring the local strategy for use by Passport.
passport.use(
  'login',
  new LocalStrategy({
    passReqToCallback: true
  },
  function (req, email, password, cb) {
    // Validating before querying
    if (email === '') {
      req.flash('error', 'Email provided is empty')
      return cb(null, false)
    }

    if (password === '') {
      req.flash('error', 'Password provided is empty')
      return cb(null, false)
    }

    if (email && password) {
      User.findOne({
        where: {
          email: email
        }
      }).then(function (user) {
        let userData = JSON.stringify(user)
        if (userData !== 'null') {
          bcrypt.compare(password, user.password, function (err, res) {
            if (err) {
              logger.error(err)
              req.flash(
                'error',
                'Sorry, Error occurred during password verification'
              )
              return cb(null, false)
            }
            if (res) {
              return cb(null, user)
            } else {
              req.flash('error', 'Incorrect password')
              return cb(null, false)
            }
          })
        } else {
          // Setting login status since passport flash is not working
          req.flash('error', 'Incorrect username or password.')
          return cb(null, false)
        }
      })
    }
  })
)

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
  cb(null, user.user_id)
})

passport.deserializeUser(function (id, cb) {
  User.findOne({
    where: {
      user_id: id
    }
  }).then(function (user) {
    let userData = JSON.stringify(user)

    if (userData !== 'null') {
      cb(null, user)
    } else {
      cb(new Error('Invalid User'), false)
    }
  })
})

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())
app.locals.passport = passport

// =========================== Including Routes ========================
// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if (file.substr(-3) === '.js') {
    var route = require('./controllers/' + file)
    route.controller(app)
  }
})

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
  res.status(404)
  res.render('404')
})

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
  logger.error(err.stack)
  let errorData = {}
  if (app.get('env') === 'development') {
    errorData.message = err.message
    errorData.stack = err.stack
  }

  res.render('500', {errorData: errorData})
})

// Receiving socket IO instance and returns app instance to app.js
module.exports = function (io) {
  app.locals.io = io
  require('./lib/socketHelper')(io)
  return app
}
