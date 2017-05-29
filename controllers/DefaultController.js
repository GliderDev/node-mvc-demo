/*
 * Default Controller
 *
 * This controller is used group default route function
 */
var authHelper = require('../lib/authHelper')
var flashHelper = require('../lib/flashHelper')
var async = require('async')

module.exports.controller = function (app) {
  // Home Page
  app.get('/', authHelper.ensureAuth, function (req, res) {
    res.render('default/index')
  })

  app.get(
    '/dashboard/counts',
    // authHelper.ensureAuth,
    getCounts
  )

} // End of Default Controller

var getCounts = function (req, res, next) {
  let dashCounts = {}
  let Codebase = req.app.locals.Codebase
  let Domain = req.app.locals.Domain
  let Subdomin = req.app.locals.Subdomain
  let User = req.app.locals.User

  async.waterfall([
    function (done) {
      Domain.count().then(function (catCount) {
        dashCounts.categories = catCount
        done(null, dashCounts)
      })
    },
    function (dashCounts, done) {
      Subdomin.count().then(function (subCatCount) {
        dashCounts.subCategories = subCatCount
        done(null, dashCounts)
      })
    },
    // function (dashCounts, done) {
    //   User.count().then(function (userCount) {
    //     dashCounts.users = userCount
    //     done(null, dashCounts)
    //   })
    // },
    function (dashCounts, done) {
      res.json(dashCounts)
    },
  ], function (err) {
    next(new Error(err))
  })
}
