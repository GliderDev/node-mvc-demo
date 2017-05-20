
$(document).ready(function () {
  $('#register-me').click(function (event) {
    event.preventDefault();
    
    var fname = $('#f_name').val()
    var email = $('#email').val()
    var pass = $('#password').val()
    var empcode = $('#empcode').val()
    var uploads = $('#uploads').val()

    var error = false

    if(fname === ''){
      error = true
      $('.f_name-error-msg').append(
        "<p>First name can't be empty</p>"
      ).removeClass('hide')
    }

    if(empcode === ''){
      error = true
      $('.empcode-error-msg').append(
        "<p>Employee code can't be empty</p>"
      ).removeClass('hide')
    }

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

    if(uploads === ''){
      error = true
      $('.uploads-error-msg').append(
        "<p>Please upload a profile pic</p>"
      ).removeClass('hide')
    }

    if (!error) $('#login-form').submit()
  })
})
