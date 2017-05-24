var config = require('../lib/config')
var User = require('./orm/User')

/**
 * Remember me functionality middleware
 *
 * @param {object}   req  Request object
 * @param {object}   res  Response object
 * @param {function} next Callback function
 */
var rememberMe = function (req, res, next) {
  if (req.body.remember) {
    // Cookie expires after 30 days (2592000000 milliseconds)
    req.session.cookie.maxAge = config.rememberMeInterval
  }
  next()
}

/**
 * Middleware to check authentication
 *
 * @param {object} req  Request object
 * @param {object} res  Response object
 * @param {object} next Callback function
 */
var ensureLogin = function (req, res, next) {
  if (req.isAuthenticated()) {
    // Sets uses image to global variable
    if (req.user.profile_pic !== null) {
      req.app.locals.profileImage = req.user.profile_pic
    } else {
      req.app.locals.profileImage = 'user_avatar.png'
    }

    // Sets uses user first name to global variable
    req.app.locals.userFirstName = req.user.first_name
    next()
  } else {
    res.redirect('/auth/login')
  }
}

/**
 * To generate reset password token and to send
 * password reset acknowledgment email
 * @param {object} req  Request object
 * @param {object} res  Response object
 */
var forgotPassword = function (req, res) {
  let resetEmail = req.body.email
  let async = require('async')
  let crypto = require('crypto')
  let emailModule = require('../lib/email')

  async.waterfall([
    function (done) {
      if (resetEmail !== '' && resetEmail.length) {
        User.findOne({
          where: {
            email: resetEmail
          }
        }).then(function (userObj) {
          if (userObj !== null) {
            done(null, userObj)
          } else {
            let message = 'No account with this Email: ' +
              resetEmail + ' exists.'

            req.session.authFlash = {
              type: 'forgotStatus',
              message: message
            }
            done(new Error(message))
          }
        })
      } else {
        req.session.authFlash = {
          type: 'forgotStatus',
          message: "Email can't be empty"
        }
        done(new Error("Email can't be empty"))
      }
    },
    function (userObj, done) {
      crypto.randomBytes(20, function (err, buf) {
        if (err) done(err)
        let token = buf.toString('hex')
        let expiry = Date.now() + config.forgotPasswordTokenExpiry
        token += '_' + expiry
        // Saves password reset token in database
        userObj.update({password_reset_token: token})
        done(null, userObj)
      })
    },
    function (userObj, done) {
      let emailData = {
        from: config.email,
        to: userObj.email,
        subject: 'DM Demo site Password Reset',
        data: 'You are receiving this because you (or someone else) ' +
          'have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this ' +
          'into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/auth/reset/' +
          userObj.password_reset_token + '\n\n' +
          'If you did not request this, please ignore this email ' +
          'and your password will remain unchanged.\n'
      }

      // Sends Email
      emailModule.sendEmail(emailData, false, function (err, status) {
        let message

        if (err) {
          done(err)
        }

        if (status) {
          message = 'An e-mail has been sent to ' +
            userObj.email + ' with further instructions.'
          req.session.authFlash = {
            type: 'forgotSuccessStatus',
            message: message
          }
          done()
        } else {
          message = 'Sorry An Error occurred while sending Email, ' +
            'Please try again after sometime'
          req.session.authFlash = {
            type: 'forgotStatus',
            message: message
          }
          done(new Error(message))
        }
      })
    }
  ], function (err) {
    if (err) {
      // Intentionally left blank since in error and success cases,
      // page has to redirect to forgot password page.
    }

    res.redirect('/auth/forgot')
  })
}

/**
 * To validate token and render page to enter new password
 * @param {object} req  Request object
 * @param {object} res  Response object
 */
var validatePasswordResetToken = function (req, res, next) {
  let token = req.params.token
  let datetime = require('node-datetime')

  // Skipping validation since it's a redirect from POST request
  if (req.session.resetStatus) next()

  if (token.length && token !== '') {
    User.findOne({
      where: {
        password_reset_token: token
      }
    }).then(function (userObj) {
      if (userObj !== null) {
        if (token === userObj.password_reset_token) {
          let expire = parseInt(token.split('_')[1])
          let currentTime = datetime.create(Date.now())
          let expiryTime = datetime.create(expire)

          // Checks if token expired
          if (currentTime.getTime() > expiryTime.getTime()) {
            req.session.resetStatus = {
              type: 'fail',
              message: 'Token Expired, Please go to forgot password page ' +
              'to generate new token'
            }
            next()
          } else {
            req.session.resetStatus = {
              type: '',
              message: ''
            }
            next()
          }
        } else {
          req.session.resetStatus = {
            type: 'fail',
            message: 'Invalid Token'
          }
          next()
        }
      } else {
        req.session.resetStatus = {
          type: 'fail',
          message: 'User not found'
        }
        next()
      }
    })
  } else {
    req.session.resetStatus = {
      type: 'fail',
      message: 'Token is empty'
    }
    next()
  }
}

var resetPassword = function (req, res) {
  let password = req.body.password
  let confirmPassword = req.body.confirmPassword
  let bcrypt = require('bcrypt')

  if (password.length &&
      confirmPassword.length &&
      password === confirmPassword
  ) {
    bcrypt.hash(password, config.passwordSaltRounds, function (err, hash) {
      if (err) {
        req.session.resetStatus = {
          type: 'fail',
          message: 'Error occurred while encrypting the password'
        }
        res.redirect('/auth/reset/' + req.body.resetToken)
      }

      if (hash.length) {
        User.findOne({
          where: {
            password_reset_token: req.body.resetToken
          }
        }).then(function (userObj) {
          if (userObj !== null) {
            userObj.update({
              password: hash,
              password_reset_token: ''
            })
            req.session.resetSuccessStatus = {
              type: 'success',
              message: 'Password successfully changed,' +
                ' Please login with the your new password'
            }
            res.redirect('/auth/login')
          } else {
            req.session.resetStatus = {
              type: 'fail',
              message: 'User not found for this token'
            }
            res.redirect('/auth/reset/' + req.body.resetToken)
          }
        })
      } else {
        req.session.resetStatus = {
          type: 'fail',
          message: 'Oops!, encrypted password is empty'
        }
        res.redirect('/auth/reset/' + req.body.resetToken)
      }
    })
  } else {
    req.session.resetStatus = {
      type: 'fail',
      message: "Password Entered is either empty or doesn't match"
    }
    res.redirect('/auth/reset/' + req.body.resetToken)
  }
}

/**
 * To Register new user
 *
 * @param {object} req  Request object
 * @param {object} res  Response object
 */
var registerUser = function (req, res) {
  let firstName = req.body.f_name
  let lastName = req.body.l_name
  let email = req.body.email
  let password = req.body.password
  let dob = req.body.dob
  let phone = req.body.phone
  let empcode = req.body.empcode
  let imgObj = req.files.uploads
  let profilePic = ''
  let path = require('path')
  let bcrypt = require('bcrypt')

  if (imgObj) {
    profilePic = imgObj.name
    // Uploading image to /public/uploads directory
    imgObj.mv(path.join(__dirname, '/../public/uploads/', profilePic), function (err) {
      if (err) { new Error('error while uploading file ' + err) }
    })
  }

  bcrypt.hash(password, config.passwordSaltRounds, function (err, hash) {
    if (err) new Error('error while encrypting password ' + err)
    // Inserting User data
    User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hash,
      dob: dob,
      phone: phone,
      emp_code: empcode,
      profile_pic: profilePic,
      status: 1
    }).then(function (user) {
      req.session.authFlash = {
        type: 'loginSuccessStatus',
        message: 'Registration done successfully, Please login to continue'
      }
      res.redirect('/auth/login')
    })
  })
}

module.exports.rememberMe = rememberMe
module.exports.ensureLogin = ensureLogin
module.exports.forgotPassword = forgotPassword
module.exports.validatePasswordResetToken = validatePasswordResetToken
module.exports.resetPassword = resetPassword
module.exports.registerUser = registerUser
