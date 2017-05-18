/*
 * Default Controller
 *
 * This controller is used group default route function
 */

// gets controller name and relative path
var path = require('path')
var ctrlName = path.basename(__filename).split('.')[0].toLowerCase()

module.exports.controller = function (app) {
  var csrf = app.locals.csrfProtection
  console.log()
    // Home Page
  app.get('/',
    // require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      var title = ''
      var href = ''
      if (req.isAuthenticated()) {
        title += ' ' + req.user.first_name
        href = 'logout'
        res.render(ctrlName + '/index', {
          title: title,
          href: href,
          csrf: csrf
        })
      } else {
        title += ' Guest'
        href = 'login'
        res.redirect('/auth/login')
      }
    })
} // End of Default Controller
