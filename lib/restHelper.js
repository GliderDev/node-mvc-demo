/**
 * REST Helper
 *
 * A Helper to make REST service using the passed data
 *
 * Syntax Example:
 * --------------------
 * const restHelper = require('../lib/resrHelper')
 *
 * let restData = {
 *    statusCode: 200,
 *    data: {test: 'hello world'}
 *  }
 *
 *  restHelper(restData, res, function (err, status) {
 *    if (err) next(new Error(err))
 *    console.log('status: ' + status)
 *    res.end()
 *  })
 */
module.exports.restHelper = function (data, res, wsCallback) {
  let wsType
  let wsStatusCode
  let wsData

  // Validates data object
  if (typeof (data) === 'undefined') {
    wsCallback(
      'expecting an object but argument passed is undefined',
      false
    )
  } else {
    // Validates webservice type
    if (typeof (data.type) === 'undefined') {
      wsType = 'rest'
    } else {
      wsType = data.type.toLowerCase()

      if (wsType !== 'wsType') {
        return wsCallback(
          'Unknown webservice type ' + wsType,
          false
        )
      }
    }

    // Validates status code
    if (typeof (data.statusCode) === 'undefined') {
      return wsCallback(
        "status code can't be empty",
        false
      )
    } else {
      wsStatusCode = data.statusCode
      let regXp = new RegExp(/(2|3|4|5)\d{2}/)

      if (!regXp.test(wsStatusCode)) {
        return wsCallback(
          'Unknown status code ' + wsStatusCode,
          false
        )
      }
    }

    // Validates service data to be send
    if (typeof (data.data) !== 'undefined' && data.data !== null) {
      wsData = data.data
    } else {
      return wsCallback(
        "Data can't be empty",
        false
      )
    }
  }

  // Checking response object is not empty
  if (typeof (res) === 'undefined' && typeof (res) !== 'object') {
    wsCallback(
      'expecting a response object but argument passed is undefined',
      false
    )
  }

  if (wsType === 'rest') {
    res.status(wsStatusCode).json(wsData)
  }
}
