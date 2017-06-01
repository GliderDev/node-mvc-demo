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
    let userId = req.user.user_id
    var dashboardpos = []
    req.getConnection(function (err, connection) {
      if (err) {
        next(new Error(err))
        req.app.locals.logger.error(err)
      }

      connection.query(
        'SELECT * from user_meta WHERE meta_key="dashboard" and user_id=?',
        [userId],
        function (err, rows) {
          if (err) { req.app.locals.logger.error('Error deleting : %s ', err) }
          if (rows.length > 0) {
            dashboardpos = JSON.parse(rows[0].meta_val)
          }

          // Default dashboard settings if `user_meta` table is empty
          if (Object.keys(dashboardpos).length === 0) {
            dashboardpos.col7 = ['col1', 'col4']
            dashboardpos.col5 = ['col2', 'col3']
          }

          res.render('default/index', { dashboardpos: dashboardpos })
        }
      )
    })
  })

  // Save widget position
  app.post('/dashboard/userdashboard', function (req, next, data) {
    // authHelper.ensureAuth,
    let userId = req.user.user_id
    let widPosition = req.body.position

    req.getConnection(function (err, connection) {
      if (err) req.app.locals.logger.error(err)

      connection.query(
        'DELETE FROM user_meta  WHERE meta_key = "dashboard" and user_id = ? ',
        [userId],
        function (err, rows) {
          if (err) { req.app.locals.logger.error('Error deleting : %s ', err) }
        }
      )

      let data = {
        meta_key: 'dashboard',
        meta_val: widPosition,
        user_id: userId
      }

      connection.query(
        'INSERT INTO user_meta set ? '
        , data
        , function (err, rows) {
          if (err) {
            next(new Error(err))
            req.app.locals.logger.error(err)
          }
        }
      )
    })
  })

  app.get('/dashboard/init-counts', function (req, res, next) {
    dashboard.getCounts(req, res, next)
    res.json({error: false, data: {status: true}})
  })

  // app.get('/excel', function (req, res, next) {
  //   let User = app.locals.User

  //   User.findAll({
  //     attributes: ['user_id', 'first_name', 'last_name', 'email']
  //   }).then(function (userData, err) {
  //     if (err) console.log(err)
  //     userData.forEach(function (user) {
  //       req.app.locals.logger.info(user.user_id + '--' + user.first_name + '--' + user.last_name)
  //     })
  //     res.send('ok')
  //   })
  // })
} // End of Default Controller
