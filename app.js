/**
 * app.js
 *
 * Application Configuration file
 */

// Including extra Packages
var http = require('http')
var express = require('express')
var mysql = require('mysql')
var connection = require('express-myconnection')
var path = require('path')
var fs = require('fs')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser')
var csrf = require('csurf')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var expressFileUpload = require('express-fileupload')
// var dateTime = require('node-datetime')

// Including local modules
var userModel = require('./models/User')

// Configuring  csrf and bodyParser middlewares
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

// ======================== Sequelize ORM Configuring ========================
// var User = require('./models/orm/User')
// var Domain = require('./models/orm/Domain')

// User.findOne().then(function(res){
//   console.log(res.user_id);
//   console.log(res.first_name);
//   console.log(res.last_name);
// });

// Domain.findOne().then(function(res){
//   console.log(res.domain_id);
//   console.log(res.domain);
//   console.log(res.description);
// });

// ======================== RBAC Configuring ========================

// rbac = require('./models/Rbac');
// need to run only once to create permissions
// rbac.setRole();

// ======================== Authorization Configuration ======================
// Configuring the local strategy for use by Passport.
passport.use('login', new LocalStrategy({
  passReqToCallBack: true
},
function (username, password, cb) {
  userModel.findByUsername(username, function (err, user) {
    if (err) { return cb(err) }
    if (!user) { return cb(null, false) }
    if (user.password !== password) { return cb(null, false) }
    return cb(null, user)
  })
}))

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  userModel.findById(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

// Creating express object
var app = express()

// Sets Port number as 3000 if not provided
app.set('port', process.env.PORT || 3000)

// Sets View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Adding th public folder as static flder to server css, js and images files
app.use(express.static(path.join(__dirname, 'public')))

// Database connection string
app.use(
    connection(mysql, {
      host: 'localhost',
      user: 'root',
      password: 'pass',
      port: 3306,
      database: 'dmcoderepo'
    })
)

// Adding CSRF middleware
app.use(cookieParser())

app.use(session({
  secret: 'pass',
  resave: true,
  saveUninitialized: true
}))

app.locals.csrfProtection = csrfProtection
app.locals.parseForm = parseForm
// app.locals.parseFileUploads = parseFileUploads;
app.use(parseForm)
app.use(expressFileUpload())

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())
app.locals.passport = passport

// flash message middleware
app.use(require('flash')())
app.use(function (req, res, next) {
    // if there's a flash message, transfer
    // it to the context, then clear it
    // res.locals.flash = req.session.flash;
  if (req.session.flash) {
    delete req.session.flash
  }
  next()
})

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
  console.error(err.stack)
  res.status(500)
  res.render('500')
})

// Creating Server Instance
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express started in ' + app.get('env') +
        ' mode on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.')
})
