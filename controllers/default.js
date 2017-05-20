/*
 * Default Controller
 *
 * This controller is used group default route function
 */

// gets controller name and relative path
var path = require('path')
var auth = require('../models/Auth')
var ctrlName = path.basename(__filename).split('.')[0].toLowerCase()

module.exports.controller = function (app) {
  var csrf = app.locals.csrfProtection
    // Home Page
  app.get('/',
    auth.ensureLogin,
    function (req, res) {
      var user = req.user.first_name
      var userPic = req.user.profile_pic
      res.render(ctrlName + '/index', {
        user: user,
        userPic: userPic
        
      })
    })
} // End of Default Controller
