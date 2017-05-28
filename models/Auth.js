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
            req.flash(
              'error',
              message
            )
            done(new Error(message))
          }
        })
      } else {
        req.flash(
          'error',
          "Email can't be empty"
        )
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
          req.flash(
            'success',
            message
          )
          done()
        } else {
          message = 'Sorry An Error occurred while sending Email, ' +
            'Please try again after sometime'
          req.flash(
            'error',
            message
          )
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
            req.flash(
              'error',
              'Token Expired, Please go to forgot password page ' +
              'to generate new token'
            )
            next()
          } else {
            next()
          }
        } else {
          req.flash(
            'error',
            'Invalid Token'
          )
          next()
        }
      } else {
        req.flash(
          'error',
          'User not found'
        )
        next()
      }
    })
  } else {
    req.flash(
      'error',
      'Token is empty'
    )
    next()
  }
}

var resetPassword = function (req, res, next) {
  let password = req.body.password
  let confirmPassword = req.body.confirmPassword
  let bcrypt = require('bcrypt')

  if (password.length &&
      confirmPassword.length &&
      password === confirmPassword
  ) {
    bcrypt.hash(password, config.passwordSaltRounds, function (err, hash) {
      if (err) {
        next(new Error('Error occurred while encrypting the password'))
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
            req.flash(
              'success',
              'Password successfully changed,' +
                ' Please login with the your new password'
            )
            res.redirect('/auth/login')
          } else {
            req.flash(
              'error',
              'User not found for this token'
            )
            res.redirect('/auth/reset/' + req.body.resetToken)
          }
        })
      } else {
        req.flash(
          'error',
          'Oops!, encrypted password is empty'
        )
        res.redirect('/auth/reset/' + req.body.resetToken)
      }
    })
  } else {
    req.flash(
      'error',
      "Password Entered is either empty or doesn't match"
    )
    res.redirect('/auth/reset/' + req.body.resetToken)
  }
}

/**
 * To Register new user
 *
 * @param {object}   req  Request object
 * @param {object}   res  Response object
 * @param {function} next Callback function
 */
var registerUser = function (req, res, next) {
  let firstName = req.body.f_name
  let lastName = req.body.l_name
  let email = req.body.email
  let password = req.body.password
  let datetime = require('node-datetime');
  let dob = datetime.create(req.body.dob).format('Y-m-d')
  let doj = datetime.create().format('Y-m-d')
  let phone = req.body.phone
  let empcode = req.body.empcode
  let imgObj = req.files.uploads
  let profilePic = ''
  let path = require('path')
  let bcrypt = require('bcrypt')

  if (imgObj) {
    profilePic = imgObj.name
    // Uploading image to /public/uploads directory
    imgObj.mv(
      path.join(__dirname, '/../public/uploads/', profilePic),
      function (err) {
        if (err) {
          next(new Error('error while uploading file ' + JSON.stringify(err)))
        }
      }
    )
  }

  bcrypt.hash(password, config.passwordSaltRounds, function (err, hash) {
    if (err) {
      next(new Error('error while encrypting password ' + JSON.stringify(err)))
    }
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
      doj: doj,
      status: 1
    }).then(function (user) {
      // Add new user with User role
      req.app.locals.acl.addUserRoles(user.user_id, 'user')
      req.flash(
        'success',
        'Registration done successfully, Please login to continue'
      )
      res.redirect('/auth/login')
    })
  })
}

module.exports.rememberMe = rememberMe
module.exports.forgotPassword = forgotPassword
module.exports.validatePasswordResetToken = validatePasswordResetToken
module.exports.resetPassword = resetPassword
module.exports.registerUser = registerUser
