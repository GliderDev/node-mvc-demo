/*
 * Default Controller
 *
 * This controller is used group default route function
 */
var auth = require('../models/Auth')

module.exports.controller = function (app) {
  // Home Page
  app.get('/', auth.ensureLogin, function (req, res) {
    res.render('default/index')
  })
} // End of Default Controller
