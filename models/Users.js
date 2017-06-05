
var dateTime = require('node-datetime')
var dashboard = require('../models/Dashboard')
var config = require('../lib/config')

// Users list functionality
exports.list = function (req, res, next) {
  req.getConnection(function (err, connection) {
    if (err) req.app.locals.logger.error(err)
    connection.query('SELECT * FROM user', function (err, rows) {
      if (err) { req.app.locals.logger.error('Error Selecting : %s ', err) }
      res.render('users/view', {
        page_title: 'Users - Node.js',
        data: rows,
        dateTime: dateTime
      })
    })
  })
}

// Users add functionality
exports.add = function (req, res, next) {
  res.render('users/add', {
    page_title: 'Add Users - Node.js'
  })
}

// Users list functionality
exports.edit = function (req, res, next) {
  let id = req.params.user_id

  req.getConnection(function (err, connection) {
    if (err) req.app.locals.logger.error(err)
    connection.query('SELECT * FROM user WHERE user_id = ?', [id], function (err, rows) {
      if (err) { req.app.locals.logger.error('Error Selecting : %s ', err) }

      res.render('users/edit', {
        page_title: 'Edit Users - Node.js',
        data: rows,
        dateTime: dateTime
      })
    })
  })
}

// Users save functionality
exports.save = function (req, res, next) {
  let bcrypt = require('bcrypt')
  var input = JSON.parse(JSON.stringify(req.body))
  var img = req.files.uploads
  let User = req.app.locals.User

  var now = dateTime.create()
  var nowDate = now.format('Y-m-d')

  var birthDate = dateTime.create(input.dob)
  var dobFormat = birthDate.format('Y-m-d')
  let path = require('path')

  bcrypt.hash(input.password, config.passwordSaltRounds, function (err, hash) {
    if (err) {
      next(new Error('error while encrypting password ' + JSON.stringify(err)))
    }
    // Inserting User data
    let data = ''
    if (typeof (img) !== 'undefined' && img !== null) {
        // Uploading image to /public/uploads directory
      img.mv(path.join(__dirname, '/../public/uploads/profile/', img.name), function (err) {
        if (err) req.app.locals.logger.error(err)
      })

      data = {
        first_name: input.f_name,
        last_name: input.l_name,
        email: input.email,
        password: hash,
        password_reset_token: '',
        dob: dobFormat,
        phone: input.phone,
        emp_code: input.empcode,
        doj: nowDate,
        status: 1,
        auth_key: '',
        profile_pic: img.name
      }
    } else {
      data = {
        first_name: input.f_name,
        last_name: input.l_name,
        email: input.email,
        password: hash,
        password_reset_token: '',
        dob: dobFormat,
        phone: input.phone,
        emp_code: input.empcode,
        doj: nowDate,
        status: 1,
        auth_key: ''
      }
    }

    User.create(data).then(function (user) {
       // Add new user with User role
      req.app.locals.acl.addUserRoles(user.user_id, 'user')
      // Trigger event in front end to update dashboard counts
      dashboard.getCounts(req, res, next)
      res.redirect('/users/view')
    })
  })
}

// Users edit and save functionality
exports.save_edit = function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  var id = req.params.user_id

  var img = req.files.uploads

  var dob = dateTime.create(input.dob)
  var dobFormat = dob.format('Y-m-d')

  var now = dateTime.create()
  var nowDate = now.format('Y-m-d')
  let path = require('path')

  req.getConnection(function (err, connection) {
    if (err) req.app.locals.logger.error(err)
    let data
    if (typeof (img) !== 'undefined' && img !== null) {
         // Uploading image to /public/uploads directory
      img.mv(path.join(__dirname, '/../public/uploads/', img.name), function (err) {
        if (err) req.app.locals.logger.error(err)
      })

      data = {
        first_name: input.f_name,
        last_name: input.l_name,
        email: input.email,
        password: input.password,
        password_reset_token: '',
        dob: dobFormat,
        phone: input.phone,
        emp_code: input.empcode,
        doj: nowDate,
        status: 1,
        auth_key: '',
        profile_pic: img.name
      }
    } else {
      data = {
        first_name: input.f_name,
        last_name: input.l_name,
        email: input.email,
        password: input.password,
        password_reset_token: '',
        dob: dobFormat,
        phone: input.phone,
        emp_code: input.empcode,
        doj: nowDate,
        status: 1,
        auth_key: ''
      }
    }

    connection.query('UPDATE user set ? WHERE user_id = ? ', [data, id], function (err, rows) {
      if (err) { req.app.locals.logger.error('Error Updating : %s ', err) }

      res.redirect('/users/view')
    })
  })
}

// Users delete functionality
exports.delete = function (req, res, next) {
  var id = req.params.user_id
  console.log('ID=' + id)
  req.getConnection(function (err, connection) {
    if (err) req.app.locals.logger.error(err)
    connection.query('DELETE FROM user  WHERE user_id = ? ', [id], function (err, rows) {
      if (err) { req.app.locals.logger.error('Error deleting : %s ', err) }

      // Trigger event in front end to update dashboard counts
      dashboard.getCounts(req, res, next)

      // Removes User's role for RBAC tables
      req.app.locals.acl.removeUserRoles(id, 'user')

      res.redirect('/users/view')
    })
  })
}
