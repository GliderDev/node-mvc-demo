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
      $('#validate-message').append("<p>Email can't be empty</p>")
      $('.validate-group').removeClass('hide')
    }

    if (pass === '') {
      error = true
      // validate-message validate-group
      $('#validate-message').append("<p>Password can't be empty</p>")
      $('.validate-group').removeClass('hide')
    }

    if (!error) $('#login-form').submit()
  })
})
