/**
 * Error Handle Module
 *
 * To handle errors for different environment
 */
module.exports.handleError = function (err, req, res, next) {
  let errorData = {}
  if (process.env.NODE_ENV == 'development') {
    errorData.message = err.message
    errorData.trace = err.trace
  } else {
    errorData.message = 'Sorry an error occurred while processing your request'
    errorData.trace = null
  }
}