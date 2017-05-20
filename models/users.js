
var dateTime = require('node-datetime')

// Users list functionality

exports.list = function (req, res) {
  console.log('Users List...')

  var title = ''
  var href = ''
  if (req.isAuthenticated()) {
    title += ' ' + req.user.first_name
    href = 'logout'
  } else {
    title += ' Guest'
    href = 'login'
  }
  req.getConnection(function (err, connection) {
    var query = connection.query('SELECT * FROM user', function (err, rows) {
      if (err) { console.log('Error Selecting : %s ', err) }
      res.render('users/view', {
        page_title: 'Users - Node.js',
        data: rows,
        dateTime: dateTime,
        title: title,
        href: href
      })
    })
  })
}

// Users add functionality

exports.add = function (req, res) {
  console.log('Add User  Page...')

  var title = ''
  var href = ''
  if (req.isAuthenticated()) {
    title += ' ' + req.user.first_name
    href = 'logout'
  } else {
    title += ' Guest'
    href = 'login'
  }
  res.render('users/add', {
    page_title: 'Add Users - Node.js',
    title: title,
    href: href
  })
}

// Users list functionality

exports.edit = function (req, res) {
  console.log('Edit User  Page...')

  var title = ''
  var href = ''
  if (req.isAuthenticated()) {
    title += ' ' + req.user.first_name
    href = 'logout'
  } else {
    title += ' Guest'
    href = 'login'
  }

  var id = req.params.user_id

  req.getConnection(function (err, connection) {
    var query = connection.query('SELECT * FROM user WHERE user_id = ?', [id], function (err, rows) {
      if (err) { console.log('Error Selecting : %s ', err) }

      res.render('users/edit', {
        page_title: 'Edit Users - Node.js',
        data: rows,
        dateTime: dateTime,
        title: title,
        href: href
      })
    })
  })
}

// Users save functionality

exports.save = function (req, res) {
  console.log('Save User to DB...')

  var input = JSON.parse(JSON.stringify(req.body))
  var img = req.files.uploads

  console.log(input)

  var now = dateTime.create()
  var nowDate = now.format('Y-m-d')

  var birthdate = dateTime.create(input.dob)
  var dobformat = birthdate.format('Y-m-d')

    // Uploading image to directory
  img.mv(__dirname + '/../public/uploads/' + img.name, function (err) {
    if (err) { new Error('error while uploading file ' + err) }
  })

  req.getConnection(function (err, connection) {
    var data = {

      first_name: input.f_name,
      last_name: input.l_name,
      email: input.email,
      password: input.password,
      password_reset_token: '',
      dob: dobformat,
      phone: input.phone,
      emp_code: input.empcode,
      doj: nowDate,
      status: 1,
      auth_key: '',
      profile_pic: img.name
    }

    var query = connection.query(
          'INSERT INTO user set ? '
          , data
          , function (err, rows) {
            if (err) {
              new Error('Error while inserting :' + err)
            } else {
              res.redirect('/users/view')
            }
          }
        )
  })
}

// Users edit and save functionality

exports.save_edit = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body))
  var id = req.params.user_id

  var dob = dateTime.create(input.dob)
  var dobformat = dob.format('Y-m-d')

  var now = dateTime.create()
  var nowDate = now.format('Y-m-d')

  req.getConnection(function (err, connection) {
    var data = {

      first_name: input.f_name,
      last_name: input.l_name,
      email: input.email,
      password: input.password,
      password_reset_token: '',
      dob: dobformat,
      phone: input.phone,
      emp_code: input.empcode,
      doj: nowDate,
      status: 1,
      auth_key: '',
      profile_pic: input.uploads
    }

    connection.query('UPDATE user set ? WHERE user_id = ? ', [data, id], function (err, rows) {
      if (err) { console.log('Error Updating : %s ', err) }

      res.redirect('/users/view')
    })
  })
}

// Users delete functionality

exports.delete = function (req, res) {
  var id = req.params.user_id

  console.log('Delete id = ' + id)

  req.getConnection(function (err, connection) {
    connection.query('DELETE FROM user  WHERE user_id = ? ', [id], function (err, rows) {
      if (err) { console.log('Error deleting : %s ', err) }

      res.redirect('/users/view')
    })
  })
}
