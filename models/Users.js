
var dateTime = require('node-datetime')

// Users list functionality

exports.list = function (req, res) {
  console.log('Users List...')

  var title = req.user.first_name
  var profilePic = req.user.profile_pic
  var href = 'logout'

  // if (profilePic.length < 1) { profilePic = '' }

  req.getConnection(function (err, connection) {
    if (err) console.log(err)
    connection.query('SELECT * FROM user', function (err, rows) {
      if (err) { console.log('Error Selecting : %s ', err) }
      res.render('users/view', {
        page_title: 'Users - Node.js',
        data: rows,
        dateTime: dateTime,
        title: title,
        href: href,
        userPic: profilePic
      })
    })
  })
}

// Users add functionality

exports.add = function (req, res) {
  console.log('Add User  Page...')

  var title = req.user.first_name
  var profilePic = req.user.profile_pic
  var href = 'logout'

  // if (profilePic.length < 1) { profilePic = '' }

  res.render('users/add', {
    page_title: 'Add Users - Node.js',
    title: title,
    href: href,
    userPic: profilePic
  })
}

// Users list functionality

exports.edit = function (req, res) {
  console.log('Edit User  Page...')

  var title = req.user.first_name
  var profilePic = req.user.profile_pic
  var href = 'logout'
  var id = req.params.user_id

  // if (profilePic.length < 1) profilePic = ''

  req.getConnection(function (err, connection) {
    if (err) console.log(err)
    connection.query('SELECT * FROM user WHERE user_id = ?', [id], function (err, rows) {
      if (err) { console.log('Error Selecting : %s ', err) }

      res.render('users/edit', {
        page_title: 'Edit Users - Node.js',
        data: rows,
        dateTime: dateTime,
        title: title,
        href: href,
        userPic: profilePic
      })
    })
  })
}

// Users save functionality

exports.save = function (req, res) {
  console.log('Save User to DB...')

  var input = JSON.parse(JSON.stringify(req.body))
  var img = req.files.uploads

  var now = dateTime.create()
  var nowDate = now.format('Y-m-d')

  var birthDate = dateTime.create(input.dob)
  var dobFormat = birthDate.format('Y-m-d')
  let path = require('path')

  req.getConnection(function (err, connection) {
    if (err) console.log(err)

    if (typeof (img) !== 'undefined' && img !== null) {
        // Uploading image to /public/uploads directory
      img.mv(path.join(__dirname, '/../public/uploads/', img.name), function (err) {
        if (err) console.log(err)
      })

      var data = {
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
      var data = {
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

    connection.query(
          'INSERT INTO user set ? '
          , data
          , function (err, rows) {
            if (err) {
              console.log(err)
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

  var img = req.files.uploads

  var dob = dateTime.create(input.dob)
  var dobFormat = dob.format('Y-m-d')

  var now = dateTime.create()
  var nowDate = now.format('Y-m-d')
  let path = require('path')

  req.getConnection(function (err, connection) {
    if (err) console.log(err)

    if (typeof (img) !== 'undefined' && img !== null) {
         // Uploading image to /public/uploads directory
      img.mv(path.join(__dirname, '/../public/uploads/', img.name), function (err) {
        if (err) console.log(err)
      })

      var data = {
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
      var data = {
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
    if (err) console.log(err)
    connection.query('DELETE FROM user  WHERE user_id = ? ', [id], function (err, rows) {
      if (err) { console.log('Error deleting : %s ', err) }

      res.redirect('/users/view')
    })
  })
}
