$(document).ready(function () {
  $('#sign-in').click(function (event) {
    event.preventDefault();
    var email = $('#email').val()
    var pass = $('#password').val()
    // var rem = $('#remember').val()
    var error = false

    if (email === '') {
      error = true
      // validate-message validate-group
      $('.email-error-msg').append(
        "<p>Email can't be empty</p>"
      ).removeClass('hide')
    } else {
      let atpos = email.indexOf('@')
      let dotpos = email.lastIndexOf('.')
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
        error = true
        $('.email-error-msg').append(
          '<p>Please enter a valid e-mail address</p>'
        ).removeClass('hide')
      }
    }

    if (pass === '') {
      error = true
      // validate-message validate-group
      $('.password-error-msg').append(
        "<p>Password can't be empty</p>"
      ).removeClass('hide')
    }

    if (!error) $('#login-form').submit()
  })
})
