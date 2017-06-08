/**
 * Middleware function to validate forms
 */
module.exports.validateForm = function (req, res, next) {
  let validate = require('validate.js')

  // Gets the return url
  let hostUrl = req.protocol + '://' + req.headers.host
  let backURL = req.header('Referer') || '/'
  let pathName = backURL.replace(hostUrl, '')
  let returnRoute = pathName.replace(
    /(\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+)\/?.*/, '$1'
  )

  // gets the current route
  let route = req.url.replace(
    /(\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+)\/?.*/, '$1'
  )

  let validationRule

  // Gets the validation constraints/rules
  switch (route) {
    case '/auth/login':
      validationRule = module.exports.getSignInRules()
      break
    case '/auth/register':
      validationRule = module.exports.getUserRegisterRules()
      break
    case '/auth/forgot':
      validationRule = module.exports.getUserForgotPasswordRules()
      break
    case '/auth/reset':
      returnRoute = pathName // route with token
      validationRule = module.exports.getUserResetPasswordRules()
      break
    default:
      break
  }

  if (typeof (validationRule) !== 'undefined') {
    // Validates form and get errors
    let errors = validate(
      req.body,
      validationRule
    )

    if (errors) {
      req.app.locals.errors = errors
      res.redirect(returnRoute)
    } else {
      delete req.app.locals.errors
      next()
    }
  } else {
    next()
  }
}

/**
 * Gets the validation rules for sign in page
 */
module.exports.getSignInRules = function () {
  return {
    username: { // Username Rule
      presence: {
        message: "^email can't be blank"
      },
      email: {
        message: '^Please enter a valid email'
      }
    },
    password: { // Password rule
      presence: true,
      length: {
        minimum: 6,
        message: 'must be at least 6 characters'
      }
    }
  }
}

/**
 * Gets the validation rules for register user page
 */
module.exports.getUserRegisterRules = function () {
  return {
    f_name: { // First Name rule
      presence: {
        message: "^First Name can't be blank"
      },
      length: {
        maximum: 25,
        tooLong: '^Only %{count} characters is allowed'
      }
    },
    l_name: { // Last Name rule
      presence: false
    },
    email: { // Email Rule
      presence: {
        message: "^email can't be blank"
      },
      email: {
        message: '^Please enter a valid email'
      }
    },
    password: { // Password rule
      presence: true,
      length: {
        minimum: 6,
        message: 'must be at least 6 characters'
      }
    },
    dob: { // Date of birth rule
      presence: {
        message: "^Date Of birth can't be blank"
      },
      format: {
        pattern: '\\d{2}\\/\\d{2}\\/\\d{4}',
        message: '^Please enter a valid date of birth'
      }
    },
    phone: { // Phone number rule
      presence: {
        message: "^Phone number can't be empty"
      },
      format: {
        pattern: '\\d{6,15}',
        message: '^Please enter a valid phone number'
      }
    },
    empcode: { // Employee code rule
      presence: {
        message: "^Employee code can't be empty"
      },
      format: {
        pattern: '[a-zA-Z0-9]{4,7}',
        message: '^Please enter a valid employee'
      }
    },
    uploads: { // file upload rule
      presence: false
    }
  }
}

/**
 * Gets the validation rules for forgot password page
 */
module.exports.getUserForgotPasswordRules = function () {
  return {
    email: { // Email Rule
      presence: {
        message: "^email can't be blank"
      },
      email: {
        message: '^Please enter a valid email'
      }
    }
  }
}

/**
 * Gets the validation rules for forgot password page
 */
module.exports.getUserResetPasswordRules = function () {
  return {
    password: { // Password rule
      presence: true,
      length: {
        minimum: 6,
        message: 'must be at least 6 characters'
      }
    },
    confirmPassword: {
      // You need to confirm your password
      presence: true,
      // and it needs to be equal to the other password
      equality: {
        attribute: 'password',
        message: '^The passwords does not match'
      }
    }
  }
}
