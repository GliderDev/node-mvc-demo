/*
 * Default Controller
 *
 * This controller is used group default route function
 */
var authHelper = require('../lib/authHelper')
var flashHelper = require('../lib/flashHelper')

module.exports.controller = function (app) {
  // Home Page
  app.get('/', authHelper.ensureAuth, function (req, res) {
    let flashMsg = {
      type: 'error',
      message: flashHelper.getFlash(res, 'unauthorized')
    }

    res.render('default/index')
  })
} // End of Default Controller
