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
        pattern: /\d{2}\/\d{2}\/\d{4}/,
        message: '^Please enter a valid date of birth'
      }
    },
    phone: { // Phone number rule
      presence: {
        message: "^Phone number can't be empty"
      },
      format: {
        pattern: /\d{6,15}/,
        message: '^Please enter a valid phone number'
      }
    },
    empcode: { // Employee code rule
      presence: {
        message: "^Employee code can't be empty"
      },
      format: {
        pattern: /[a-zA-Z0-9]{4,7}/,
        message: '^Please enter a valid employee'
      }
    },
    uploads: { // file upload rule
      presence: false
    }
  }
}
