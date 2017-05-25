/*
 * Default Controller
 *
 * This controller is used group default route function
 */
var authHelper = require('../lib/authHelper')

module.exports.controller = function (app) {
  // Home Page
  app.get('/', authHelper.ensureAuth, function (req, res) {
    res.render('default/index')
  })
} // End of Default Controller
