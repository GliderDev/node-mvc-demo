// Setting global variables
var authRule
var formId
$(document).ready(function () {
  // Gets validation rules
  getAuthRules()

  // Validates form
  if (typeof (formId) !== 'undefined') {
    var form = $(formId)
    form.submit(function (event) {
      validateForm(form, event)
    })
  }
}) // End of ready event

/**
 * To validate forms using validate.js
 * @param {object} form  DOM form object
 * @param {object} event DOM event object
 */
function validateForm (form, event) {
  if (typeof (authRule) !== 'undefined' && form.length) {
    var errors = validate(form, authRule)
    if (errors) {
      event.preventDefault()
    }
    showErrors(errors)
  }
}
/**
 * To validate email address
 * @param {object} errors Validation error response object
 */
function showErrors (errors) {
  resetFormMessages()
  $.each(errors, function (input) {
    var obj = $('input[name=' + input + ']').next()
    obj.html(errors[input]).removeClass('hide')
  })
}

/**
 * To hide all the error messages
 * @param {object} form Form DOM object
 */
function resetFormMessages (form) {
  $('.alert-danger').addClass('hide')
}

/**
 * Gets the constraints/rules to validate forms
 */
function getAuthRules () {
  var url
  var route = window.location.pathname.replace(
    /(\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+)\/?.*/, '$1'
  )

  switch (route) {
    case '/auth/login':
      url = '/auth/get-login-rules'
      formId = '#login-form'
      break
    case '/auth/register':
      url = '/auth/get-register-rules'
      formId = '#register-form'
      break
    case '/auth/forgot':
      url = '/auth/get-forgot-rules'
      formId = '#forgot-form'
      break
    case '/auth/reset':
      url = '/auth/get-reset-rules'
      formId = '#reset-password-form'
      break
    default:
      break
  }

  if (typeof (url) !== 'undefined') {
    httpGet(url, '', function (response) {
      if (response.error) {
        throw new Error(response.message)
      } else {
        authRule = response.data
      }
    })
  }
}

/**
 * Sends HTTP GET request to given url and data and
 * gets the response
 * @param  {string} url
 * @param  {string} data
 * @return {object}
 */
function httpGet (url, data, responseCallback) {
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
        if (typeof (responseData.error) === 'undefined' ||
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
