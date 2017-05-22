/*
 * Default Controller
 *
 * This controller is used group default route function
 */
var auth = require('../models/Auth')

module.exports.controller = function (app) {
  // Home Page
  app.get('/',
    auth.ensureLogin,
    function (req, res) {
      var user = req.user.first_name
      var userPic = req.user.profile_pic
      res.render('default/index', {
        title: user,
        userPic: userPic,
        href: 'logout'
      })
    })
} // End of Default Controller
