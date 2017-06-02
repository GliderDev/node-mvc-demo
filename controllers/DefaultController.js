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

  app.get('/dashboard/codebase', function (req, res, next) {
    var codeBase = req.app.locals.Codebase
    var html = ''
    codeBase.findAll({
      order: [['codebase_id', 'DESC']]
    }).then(function (allCodeBase) {
      console.log('All codebase = ' + JSON.stringify(allCodeBase))
      allCodeBase.forEach(function (element) {
        html += ' <a href="/"  id="codebase_' + element.codebase_id + '"> ' +
        element.name + '</a>' +
        ' <small class="label label-info"><i class="fa fa-clock-o"></i>' + element.domain_id + '</small>'
      })
      res.json({error: false,
        data: {
          html: html
        }})
    })
  })

  app.get('/dashboard/init-counts', function (req, res, next) {
    dashboard.getCounts(req, res, next)
    res.json({error: false, data: {status: true}})
  })

  app.get('/excel', function (req, res, next) {
    let User = app.locals.User
    let datetime = require('node-datetime')

    // Require library
    const xl = require('excel4node')

    // Create a new instance of a Workbook class
    let wb = new xl.Workbook()

    let theadStyle = wb.createStyle({
      alignment: {
        horizontal: ['center']
      },
      font: {
        bold: true,
        size: 10
      },
      border: {
        top: {
          style: 'medium',
          color: 'ffffff'
        },
        bottom: {
          style: 'medium'
        },
        left: {
          style: 'medium'
        },
        right: {
          style: 'medium'
        }
      },
      fill: {
        type: 'pattern', // the only one implemented so far.
        patternType: 'solid', // most common.
        fgColor: 'cccccc'
      }
    })

    let tbodyCenterStyle = wb.createStyle({
      alignment: {
        horizontal: ['center']
      },
      font: {
        bold: true,
        size: 10
      },
      border: {
        top: {
          style: 'medium',
          color: 'ffffff'
        },
        bottom: {
          style: 'medium'
        },
        left: {
          style: 'medium'
        },
        right: {
          style: 'medium'
        }
      }
    })

    let tbodyLeftStyle = wb.createStyle({
      alignment: {
        horizontal: ['left']
      },
      font: {
        bold: true,
        size: 10
      },
      border: {
        top: {
          style: 'medium',
          color: 'ffffff'
        },
        bottom: {
          style: 'medium'
        },
        left: {
          style: 'medium'
        },
        right: {
          style: 'medium'
        }
      }
    })

    // Add Worksheets to the workbook
    let ws = wb.addWorksheet('User Data')

    var totalRows = 6
    // var totalCols = 0

    // Setting column widths
    ws.column(1).setWidth(8) // for ID
    ws.column(2).setWidth(15) // for First Name
    ws.column(3).setWidth(15) // for Last Name
    ws.column(4).setWidth(25) // for Email
    ws.column(5).setWidth(15) // for DOB
    ws.column(6).setWidth(15) // for DOJ

    // Setting Headings
    ws.cell(1, 1, 1, totalRows, true).string('User Data').style(theadStyle)
    ws.cell(2, 1).string('ID').style(theadStyle)
    ws.cell(2, 2).string('First Name').style(theadStyle)
    ws.cell(2, 3).string('Last Name').style(theadStyle)
    ws.cell(2, 4).string('Email').style(theadStyle)
    ws.cell(2, 5).string('Date of Birth').style(theadStyle)
    ws.cell(2, 6).string('Date of Join').style(theadStyle)

    User.findAll({
      attributes: [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'dob',
        'doj'
      ]
    }).then(function (userData, err) {
      if (err) next(new Error(err))

      // totalCols = Object.keys(userData).length
      let userDataRow = 2
      userData.forEach(function (user, i) {
        userDataRow++

        // req.app.locals.logger.info(
        //   user.user_id + '--' +
        //   user.first_name + '--' +
        //   user.last_name + '--' +
        //   user.doj)

        // Writing user id
        ws.cell(userDataRow, 1)
          .number(user.user_id)
          .style(tbodyCenterStyle)

        // Writing first name
        ws.cell(userDataRow, 2)
          .string(user.first_name)
          .style(tbodyLeftStyle)

        // Writing last name
        ws.cell(userDataRow, 3)
          .string(user.last_name)
          .style(tbodyLeftStyle)

        // Writing email
        ws.cell(userDataRow, 4)
          .string(user.email)
          .style(tbodyLeftStyle)
        let dob = datetime.create(user.dob)
        dob = dob.format('m/d/y H:M')
        console.log(dob)
        // Writing DOB
        ws.cell(userDataRow, 5)
          .date(dob)
          .style(tbodyCenterStyle)

        // // Writing DOJ
        // ws.cell(userDataRow, 6)
        //   .string(user.doj)
        //   .style(tbodyCenterStyle)
      })

      // Writing excel to file
      wb.write('test.xlsx')
      res.send('k')
    })
  })
} // End of Default Controller
