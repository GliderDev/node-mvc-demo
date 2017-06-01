function cancelAdd () {
  window.location.href = '/'
}
function cancelEdit () {
  window.location.href = '/users/view'
}
// declaring socket object
var socket;

$(document).ready(function () {
  // Calling function to show/hide html content based on user role
  showRoleBasedData()

  // Calling function to show dashboard counts
  getDashboardCounts()

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

  $('#cat_new').click(function (clickEvent) {
    clickEvent.preventDefault()
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
              window.location.reload()
              // window.alert('success')
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
  })

  // Sortable widgets
  $('.connectedSortable').sortable({
    stop: function (event, ui) {
      var arr = {}
      $('.connectedSortable').each(function () {
        var thisId = $(this).attr('id')
        var arrId = []
        $('#' + thisId + ' > div').map(function () {
          arrId.push(this.id)
        })
        // console.log("inner array -> "+JSON.stringify(arrId));
        arr[thisId] = JSON.parse(JSON.stringify(arrId))
        // console.log("inner json -> "+JSON.stringify(arr));
      })

      $.ajax({
        type: 'POST',
        url: '/dashboard/userdashboard',
        data: { position: JSON.stringify(arr) },
        cache: false,
        success: function (optionData) {
        },
        error: function (error) {
          console.log('error')
        }
      })
    }
  })

  $('#submitBtn').click(function (event) {
    event.preventDefault()

    // var catValue = $('#category-list').val()
    // var title = $('#title').val()
    // var description = $('#desc').val()

    if (!error) $('#codeBaseForm').submit()
  })

  $('#chat-send').click(function (event) {
    var message = $('#chat-text').val()
    $('#chat-text').val('')
    // tell server to execute 'sendchat' and send along one parameter
    socket.emit('sendchat', message)
  })

  // when the client hits ENTER on their keyboard
  $('#chat-text').keypress(function (e) {
    if (e.which === 13) {
      $(this).blur()
      $('#chat-send').focus().click()
    }
  })
}) // End of Document ready event

/**
 * To show/hide html content based on user role
 */
function showRoleBasedData () {
  httpGet('/auth/user-role', '', function (responseData) {
    if (responseData.error) {
      window.alert(responseData.message)
    } else {
      var role = responseData.data.role

      // Show respective data in page based on role
      if (role === 'user') {
        $('.user-role').show()
      } else if (role === 'admin') {
        $('.admin-role').show()
        $('.user-role').show()
      } else {
        window.alert(
          'user role has not assigned, please contact you Administrator'
        )
      }
    }
  })
}

/**
 * To show Dashboard downloads, catagories, subcategories and active user counts
 */
function getDashboardCounts () {
  socket = io()
  var chatRoom = 'dashboard-chat'
  var username = $('#user-first-name').text()
  if (window.location.pathname === '/') {
    httpGet('/dashboard/init-counts', '', function (res){
    })

    // on connection to server, ask for user's name with an anonymous callback
    socket.on('connect', function () {
      // call the server-side function 'adduser' and send one parameter (value of prompt)
      socket.emit('adduser', username)
    })
  }

  // Listen to event to get dashboard counts
  socket.on('update-dashboard-counts', function (responseData) {
    if (!responseData.error) {
      // Changes Dashboard counts using jQuery
      changeDashboardCounters(responseData.data)
    } else {
      console.log('Error in Socket Response' + JSON.stringify(responseData))
    }
  })

  // listener, whenever the server emits 'updatechat', this updates the chat body
  socket.on('updatechat', function (username, data) {
    $('#chat-messages').append('<b>' + username + ':</b> ' + data + '<br>')
  })


}

/**
 * To do DOM changes to show dashboard counts
 * @param {object} dashboardData
 */
function changeDashboardCounters (dashboardData) {
  $('#total-downloads').text(dashboardData.downloads)
  $('#total-cat').text(dashboardData.categories)
  $('#total-users').text(dashboardData.totalUsers)
  // $('#active-users').text(dashboardData.activeUsers)
}

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

/**
 * Sends HTTP POST request to given url and data and
 * gets the response
 * @param  {string} url
 * @param  {string} data
 * @return {object}
 */
function httpPost (url, data) {
  if (typeof (url) === 'undefined') {
    return {error: true, message: 'Url is undefined'}
  }

  if (typeof (data) === 'undefined') {
    return {error: true, message: 'data is undefined'}
  }

  if (!isJson(data)) {
    return {error: true, message: 'data is not a JSON object'}
  }

  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    cache: false,
    success: function (responseData) {
      if (isJson(responseData)) {
        if (responseData.error === 'undefined' ||
            responseData.error === null
        ) {
          return {
            error: true,
            message: 'Error data is null or undefined in response JSON'
          }
        } else {
          return responseData
        }
      } else {
        return {
          error: true,
          message: 'Response data is not a JSON object'
        }
      }
    },
    error: function (error) {
      return {
        error: true,
        message: error
      }
    }
  })
}

/**
 * Sends HTTP GET request to given url and data and
 * gets the response
 * @param  {string} url
 * @param  {string} data
 * @return {object}
 */
function httpGet (url, data = '', responseCallback) {
  if (typeof (url) === 'undefined') {
    return responseCallback({
      error: true,
      message: 'Url is undefined'
    })
  }

  if (typeof (data) === 'undefined') {
    return responseCallback({
      error: true,
      message: 'data is undefined'
    })
  }

  if (data.length && !isJson(data)) {
    return responseCallback({
      error: true,
      message: 'data is not a JSON object'
    })
  }

  $.ajax({
    type: 'GET',
    url: url,
    data: data,
    cache: false,
    success: function (responseData) {
      if (isJson(responseData)) {
        if (responseData.error === 'undefined' ||
            responseData.error === null
        ) {
          return responseCallback({
            error: true,
            message: 'Error data is null or undefined in response JSON'
          })
        } else {
          return responseCallback(responseData)
        }
      } else {
        return responseCallback({
          error: true,
          message: 'Response data is not a JSON object'
        })
      }
    },
    error: function (error) {
      return responseCallback({
        error: true,
        message: error
      })
    }
  })
}

/**
 * To Check if a given data is JSON data or not
 * @param  {*}       item
 * @return {boolean}
 */
function isJson (item) {
  item = typeof item !== 'string'
      ? JSON.stringify(item)
      : item

  try {
    item = JSON.parse(item)
  } catch (e) {
    return false
  }

  if (typeof item === 'object' && item !== null) {
    return true
  }

  return false
}
