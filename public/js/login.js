$(document).ready(function () {
  // Login page validation
  $('#sign-in').click(function (event) {
    event.preventDefault()
    var email = $('#email').val()
    var pass = $('#password').val()
    var error = false

    error = validateEmail(email)

    if (pass === '') {
      error = true
      // validate-message validate-group
      $('.password-error-msg').html(
        "<p>Password can't be empty</p>"
      ).removeClass('hide')
    }

    if (!error) $('#login-form').submit()
  })

  // Forgot password page validation
  $('#forgot').click(function (event) {
    event.preventDefault()

    var error = false
    var email = $('#email').val()

    error = validateEmail(email)
    if (!error) $('#forgot-form').submit()
  })

  // Password Reset page validation
  $('#reset-password').click(function (event){
    event.preventDefault()
    var pass = $('#new-password').val()
    var confirmPass = $('#confirm-password').val()

    if (pass !== confirmPass) {
      $('.new-password-error-msg').html(
        "<p>Password doesn't match, Please re-enter the password</p>"
      ).removeClass('hide')
    } else if (pass.length < 6) {
      $('.new-password-error-msg').html(
        '<p>Password must be at least 8 characters</p>'
      ).removeClass('hide')
    } else {
      $('#reset-password-form').submit()
    }
  })
})

/**
 * To validate email address
 *
 * @param  {string}  email Email to validate
 * @return {boolean} error Error flag
 */
function validateEmail (email) {
  var error = false

  if (email.length === 0) {
    error = true
    // validate-message validate-group
    $('.email-error-msg').html(
      "<p>Email can't be empty</p>"
    ).removeClass('hide')
  } else {
    let atpos = email.indexOf('@')
    let dotpos = email.lastIndexOf('.')
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
      error = true
      $('.email-error-msg').html(
        '<p>Please enter a valid e-mail address</p>'
      ).removeClass('hide')
    }
  }

  return error
}
