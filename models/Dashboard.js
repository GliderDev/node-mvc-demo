var async = require('async')
module.exports.getCounts = function (req, res, next) {
  let dashCounts = {}
  // let Codebase = req.app.locals.Codebase
  let Domain = req.app.locals.Domain
  let User = req.app.locals.User
  let io = req.app.locals.io

  async.waterfall([
    function (done) {
      // TO DO: downloads counts
      dashCounts.downloads = '-'
      done(null, dashCounts)
    },
    function (dashCounts, done) {
      Domain.count().then(function (catCount) {
        dashCounts.categories = catCount
        done(null, dashCounts)
      })
    },
    function (dashCounts, done) {
      User.count().then(function (userCount) {
        dashCounts.totalUsers = userCount
        done(null, dashCounts)
      })
    },
    // function (dashCounts, done) {
    //   let srvSockets = io.sockets.sockets
    //   let count = Object.keys(srvSockets).length
    //   dashCounts.activeUsers = count
    //   done(null, dashCounts)
    // },
    function (dashCounts, done) {
      let returnData = {
        error: false,
        data: dashCounts
      }
      io.emit('update-dashboard-counts', returnData)
    }
  ], function (err) {
    next(new Error(err))
  })
}
