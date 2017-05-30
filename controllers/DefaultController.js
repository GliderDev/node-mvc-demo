/*
 * Default Controller
 *
 * This controller is used group default route function
 */
var authHelper = require('../lib/authHelper')
var dashboard = require('../models/Dashboard')

module.exports.controller = function (app) {
  // Home Page
  app.get('/', authHelper.ensureAuth, function (req, res, next) {
    let io = req.app.locals.io
    let logger = req.app.locals.logger
    // Socket IO Connection listener
    io.on('connection', function (socket) {
      logger.info('a user connected')

      // Event Listener
      socket.on('init counts', function () {
        // Trigger event in front end to update dashboard counts
        dashboard.getCounts(req, res, next)
      })

      // Disconnect listener
      socket.on('disconnect', function () {
        logger.info('user disconnected')
      })
    })
    res.render('default/index')
  })
} // End of Default Controller

