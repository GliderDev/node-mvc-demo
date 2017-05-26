/*
 * Authorization Controller
 *
 * This controller is used for user authorization
 */

var auth = require('../models/Auth')
var authHelper = require('../lib/authHelper')
var flashHelper = require('../lib/flashHelper')

// Module definition
module.exports.controller = function (app) {
  // app local scope variable definition
  var parseForm = app.locals.parseForm
  var passport = app.locals.passport
  var csrfMiddleware = app.locals.csrfProtection

  // HTTP GET - login page route
  app.get('/auth/login', csrfMiddleware, function (req, res) {
    let message = ''
    let type = ''
    let loginSuccessMsg = flashHelper.getFlash(res, 'loginSuccessStatus')
    let loginFailMsg = flashHelper.getFlash(res, 'loginStatus')

    if (loginSuccessMsg) {
      message = loginSuccessMsg
      type = 'success'
    } else if (loginFailMsg) {
      message = flashHelper.getFlash(res, 'loginStatus')
      type = 'fail'
    } else if (req.session.resetSuccessStatus) {
      type = 'success'
      message = req.session.resetSuccessStatus.message
    }

    res.render('auth/login', {
      csrf: req.csrfToken(),
      message: message,
      type: type
    })
  })

  // HTTP POST - login form process page route
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
    }
  )

  // HTTP GET - logout page route
  app.get('/auth/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  // HTTP GET - Register page route
  app.get('/auth/register', csrfMiddleware, function (req, res) {
    res.render('auth/register', {
      csrf: req.csrfToken(),
      type: '',
      message: ''
    })
  })

  // HTTP POST - Register form processing page route
  app.post('/auth/register', csrfMiddleware, parseForm, auth.registerUser)

  // HTTP GET - Forgot password page route
  app.get('/auth/forgot', csrfMiddleware, function (req, res) {
    let type = ''
    let message = ''
    let failMsg = flashHelper.getFlash(res, 'forgotStatus')
    let SuccessMsg = flashHelper.getFlash(res, 'forgotSuccessStatus')

    if (failMsg !== '') {
      type = 'fail'
      message = failMsg
    } else if (SuccessMsg !== '') {
      type = 'success'
      message = SuccessMsg
    }

    res.render('auth/forgot', {
      csrf: req.csrfToken(),
      type: type,
      message: message
    })
  })

  // HTTP POST - forgot password form process page route
  app.post('/auth/forgot',
    parseForm, csrfMiddleware,
    auth.forgotPassword
  )

  // HTTP GET - Reset password page route
  app.get('/auth/reset/:token', csrfMiddleware,
    auth.validatePasswordResetToken, function (req, res) {
      let resetStatus = req.session.resetStatus

      res.render('auth/reset', {
        csrf: req.csrfToken(),
        type: resetStatus.type !== '' ? resetStatus.type : '',
        message: resetStatus.message !== '' ? resetStatus.message : '',
        token: req.params.token
      })
      delete req.session.resetStatus
    }
  )

  // HTTP POST - reset password form process page route
  app.post('/auth/reset',
    parseForm, csrfMiddleware,
    auth.resetPassword
  )

  /**
   * HTTP GET - To show user role
   */
  app.get(
    '/auth/user-role',
    authHelper.ensureAuth,
    function (req, res) {
      app.locals.acl.userRoles(req.user.user_id, function (err, roles) {
        if (err) {
          let errData = {
            error: true,
            message: 'Sorry an error occurred while determining user role'
          }
          app.locals.logger.error(
            req.url + ': Error response: ' +
            JSON.stringify(errData) +
            'error:' + JSON.stringify(err)
          )
          res.json(errData)
        }
        // Returns user role
        if (roles.length) {
          res.json({
            error: false,
            data: {role: roles[0]}
          })
        } else {
          let roleErrData = {
            error: true,
            message: 'user has not assigned any roles,' +
              ' Please contact you Administrator'
          }
          app.locals.logger.error(
            req.url + ': Empty user role response: ' +
            JSON.stringify(roleErrData)
          )
          res.json(roleErrData)
        }
      })
    }
  )
} // End of Authorization Controller
