/**
 * Remember me functionality middleware
 *
 * @param {object}   req 
 * @param {object}   res 
 * @param {function} next 
 */
var rememberMe = function (req, res, next) {
  if (req.body.remember) {
    // Cookie expires after 30 days (2592000000 milliseconds)
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
  }
  next()
}

/**
 * Middleware to check authentication
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
var ensureLogin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/auth/login')
  }
}

module.exports.rememberMe = rememberMe
module.exports.ensureLogin = ensureLogin
