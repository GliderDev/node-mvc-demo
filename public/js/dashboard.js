function cancelAdd () {
  window.location.href = '/'
}
function cancelEdit () {
  window.location.href = '/users/view'
}

$(document).ready(function () {
  $('#submitBtn').click(function (event) {
    event.preventDefault()

    var fname = $('#f_name').val()
    var email = $('#email').val()
    var pass = $('#password').val()
    var empcode = $('#empcode').val()
    var uploads = $('#uploads').val()

    var error = false

    if (fname === '') {
      error = true
      $('.f_name-error-msg').html(
        "<p>First name can't be empty</p>"
      ).removeClass('hide')
    }

    if (empcode === '') {
      error = true
      $('.empcode-error-msg').html(
        "<p>Employee code can't be empty</p>"
      ).removeClass('hide')
    }

    // Validates email
    error = validateEmail(email)

    if (pass === '') {
      error = true
      $('.password-error-msg').html(
        "<p>Password can't be empty</p>"
      ).removeClass('hide')
    } else if (pass.length < 6) {
      error = true
      $('.password-error-msg').html(
        '<p>Password must be at least 8 characters</p>'
      ).removeClass('hide')
    }

    if (uploads.length) {
      var fileSize = $('#uploads')[0].files[0].size
      var fileData = uploads.split('.')
      var fileExtension = fileData[fileData.length - 1]
      if (!fileExtension.match('(jpg|jpeg|png)')) {
        error = true
        $('.uploads-error-msg').html(
          '<p>Invalid Image extension. Allowed formats are jpg, jpeg and png</p>'
        ).removeClass('hide')
      } else if (fileSize > 2097152) {
        error = true
        $('.uploads-error-msg').html(
          '<p>File size is greater than 2MB is not allowed</p>'
        ).removeClass('hide')
      } else {
        $('.uploads-error-msg').addClass('hide')
      }
    }

    if (!error) $('#userForm').submit()
  })

  $('#category-list').on('change', function () {
    var value = this.value
    if (value === 'createNew') {
      $('#create-category').modal()
      $('#modalSave').click(function (event) {
        event.preventDefault()
        var title = $('#category_name').val()
        var description = $('#category_desc').val()
        if (title !== '' && description !== '') {
          $.ajax({
            type: 'POST',
            url: '/categories/create',
            data: {title: title, description: description},
            cache: false,
            success: function (optionData) {
              if (!optionData.error && optionData.data.html.length) {
                var id = optionData.data.id
                $('#category-list').html(optionData.data.html)
                $('.cat_' + id).attr('selected', true)
                window.alert('success')
              } else {
                $('.cat_default').attr('selected', true)
              }
            },
            error: function (error) {
              console.log('error')
              window.alert('error' + error)
            }
          })
        }
      })
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
