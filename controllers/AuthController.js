/*
 * Authorization Controller
 *
 * This controller is used for user authorization
 */

var auth = require('../models/Auth')
var flashHelper = require('../lib/flashHelper')
// Module definition
module.exports.controller = function (app) {
  // app local scope variable definition
  var parseForm = app.locals.parseForm
  var passport = app.locals.passport
  var csrfMiddleware = app.locals.csrfProtection

  // HTTP GET - login route
  app.get('/auth/login', csrfMiddleware, function (req, res) {
    let message = flashHelper.getFlash(res, 'loginStatus')
    res.render('auth/login', {
      csrf: req.csrfToken(),
      message: message
    })
  })

  // HTTP POST - login form process route
  app.post('/auth/login',
    passport.authenticate(
      'login', {
        failureRedirect: '/auth/login',
        failureFlash: true
      }
    ),
    parseForm,
    auth.rememberMe,
    csrfMiddleware, function (req, res) {
      res.redirect('/')
    })

  // HTTP GET - logout route
  app.get('/auth/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  // HTTP GET - Register page
  app.get('/auth/register', csrfMiddleware, function (req, res) {
    res.render('auth/register', {
      csrf: req.csrfToken()
    })
  })

  // HTTP GET - Forgot password page
  app.get('/auth/forgot', csrfMiddleware, function (req, res) {
    res.render('auth/forgot', {
      csrf: req.csrfToken()
    })
  })
} // End of Authorization Controller

