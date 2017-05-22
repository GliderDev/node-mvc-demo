var rbac = require('../models/Rbac')
var auth = require('../models/Auth')

module.exports.controller = function (app) {
  var acl = app.locals.acl
  var User = app.locals.User

  // HTTP GET - To Generate RBAC Roles
  app.get('/rbac/generate', auth.ensureLogin, function (req, res) {
    rbac.setRole(acl)
    res.redirect('/')
  })

  // HTTP GET - To assign User with a role
  app.get('/rbac/assign/:id/:role', auth.ensureLogin, function (req, res) {
    let userId = req.params.id
    let role = req.params.role
    User.find({
      where: {
        user_id: userId
      }
    }).then(function (userObj) {
      if (userObj !== null) {
        rbac.assignRole(acl, userId, role, function (err, status) {
          if (err) res.send(err)
          if (status) {
            res.send(role + ' role set from ' + userObj.first_name)
          } else {
            res.send('Something went wrong, role not assigned')
          }
        })
      } else {
        res.send('User not found')
      }
    })
  })

  // HTTP GET - To remove user role
  app.get('/rbac/remove/:id/:role', auth.ensureLogin, function (req, res) {
    let userId = req.params.id
    let role = req.params.role
    User.find({
      where: {
        user_id: userId
      }
    }).then(function (userObj) {
      if (userObj !== null) {
        rbac.removeRole(acl, userId, role, function (err, status) {
          if (err) res.send(err)
          if (status) {
            res.send(role + ' role removed for ' + userObj.first_name)
          } else {
            res.send('Something went wrong, role not assigned')
          }
        })
      } else {
        res.send('User not found')
      }
    })
  })

  // HTTP GET - To view user roles
  app.get('/rbac/role/:id', auth.ensureLogin, function (req, res) {
    let userId = req.params.id
    User.find({
      where: {
        user_id: userId
      }
    }).then(function (userObj) {
      if (userObj !== null) {
        rbac.getUserRoles(acl, userId, function (err, role) {
          if (err) res.send(err)
          if (role) {
            res.send(
                'Role assigned to ' +
                userObj.first_name +
                ' are: ' + role
            )
          } else {
            res.send('Something went wrong, could not fetch the role')
          }
        })
      } else {
        res.send('User not found')
      }
    })
  })
}
