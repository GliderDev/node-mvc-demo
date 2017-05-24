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

  /**
   * HTTP GET - To show user role
   */
  app.get('/rbac/user-role', auth.ensureLogin, function (req, res) {
    app.locals.acl.userRoles(req.user.user_id, function (err, roles) {
      if (err) {
        res.json({
          error: true,
          message: 'Sorry an error occurred while determining user role'
        })
      }
      // Returns user role
      if (roles.length) {
        res.json({
          error: false,
          data: {role: roles[0]}
        })
      } else {
        res.json({
          error: true,
          message: 'user has not assigned any roles,' +
            ' Please contact you Administrator'
        })
      }
    })
  })
}

/**
 * To check the given access role against given user id
 * Returns true if user has role, else returns false
 * @param  {object}  acl
 * @param  {integer} userId
 * @param  {string}  role
 * @return {boolean}
 */
function checkAccess (acl, userId, role) {
  let responseData = {}

  if (!acl) {
    responseData.error = true
    responseData.message = 'acl is undefined'
    return responseData
  }

  if (typeof (userId) === 'undefined' ||
      userId === null ||
      userId.length === 0
  ) {
    responseData.error = true
    responseData.message = 'user id provided is either empty or undefined'
    return responseData
  }

  if (typeof (role) === 'undefined' ||
    role === null ||
    role.length === 0
  ) {
    responseData.error = true
    responseData.message = 'user role provided is either empty or undefined'
    return responseData
  }

  acl.hasRole(userId, role, function (err, hasRole) {
    if (err) {
      responseData.error = true
      responseData.message = 'Error occured while checking user role, ' +
        'Please try again later'
      return responseData
    }

    if (hasRole) {
      responseData.error = false
      responseData.data = {hasRole: true}
      return responseData
    } else {
      responseData.error = false
      responseData.data = {hasRole: false}
      return responseData
    }
  })
}
