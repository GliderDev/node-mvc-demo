/*
 * Authorization Controller
 *
 * This controller is used for user authorization
 */

// Creating User model object
var userModel = require('../models/User');

// Module definition
module.exports.controller = function(app) {

  // app local scope variable definition
  var parseForm  = app.locals.parseForm,
  passport       = app.locals.passport,
  csrfMiddleware = app.locals.csrfProtection

  // HTTP GET - login route
  app.get('/auth/login', csrfMiddleware, function(req, res) {
      res.render('auth/login', {
        csrf: req.csrfToken()
      });
  });

  // HTTP POST - login form process route
  app.post('/auth/login', 
    passport.authenticate(
      'login', {
        failureRedirect: 'auth/fail' // redirection path on fail
    }), 
    parseForm, csrfMiddleware, function(req, res) {
      res.redirect('/');
  });

  // HTTP GET - logout route
  app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // HTTP GET - logout route
  app.get('/auth/fail', function(req, res) {
    res.render('auth/fail');
  });

  // HTTP GET - Register page
  app.get('/auth/register', csrfMiddleware, function(req, res) {
    
    res.render('auth/register', {
      csrf: req.csrfToken()
    });
  });

  // HTTP GET - Forgot password page
  app.get('/auth/forgot', csrfMiddleware, function(req, res) {
    
    res.render('auth/forgot', {
      csrf: req.csrfToken()
    });
  });

}; // End of Authorization Controller