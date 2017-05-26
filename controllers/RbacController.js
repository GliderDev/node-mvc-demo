var rbac = require('../models/Rbac')
var authHelper = require('../lib/authHelper')

module.exports.controller = function (app) {
  var acl = app.locals.acl
  var User = app.locals.User

  // HTTP GET - To Generate RBAC Roles
  app.get(
    '/rbac/generate',
    authHelper.ensureAuth,
    function (req, res) {
      rbac.setRole(acl)
      res.redirect('/')
    }
  )

  // HTTP GET - To assign User with a role
  app.get(
    '/rbac/assign/:id/:role',
    authHelper.ensureAuth,
    function (req, res) {
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
    }
  )

  // HTTP GET - To remove user role
  app.get(
    '/rbac/remove/:id/:role',
    authHelper.ensureAuth,
    function (req, res) {
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
    }
  )

  // HTTP GET - To view user roles
  app.get(
    '/rbac/role/:id',
    authHelper.ensureAuth,
    function (req, res) {
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
    }
  )

  /**
   * HTTP GET- To show allowed permission of the user
   */
  app.get('/rbac/show-permission', function (req, res) {
    req.app.locals.acl.allowedPermissions(
      req.user.user_id,
      ['user', 'rbac', '/', 'categories'],
      function (err, obj) {
        if (err) res.json(err)
        res.json(obj)
      }
      )
  })

  /**
   * HTTP GET - To check if user has access in given resource and permission
   */
  app.get(
    '/rbac/allowed/:resource/:permission',
    authHelper.ensureAuth,
    function (req, res, next) {
      req.app.locals.acl.isAllowed(
        req.user.user_id,
        req.params.resource,
        req.params.permission,
        function (err, isAllowed) {
          if (err) {
            req.app.locals.logger.error(JSON.stringify(err))
            next(new Error(err))
          }
          res.json(isAllowed)
          // Proceed to next middleware if allowed
          // else redirect to dashboard
          // if (isAllowed) {
          //   next()
          // } else {
          //   req.flash(
          //     'authError',
          //     "You're not authorized to do this action"
          //   )
          //   console.log('here')
          //   res.redirect('/')
          // }
        }
      )
    }
  )

  /**
   * HTTP GET - To create roles and permissions
   */
  app.get(
    '/rbac/set-role',
    // authHelper.ensureAuth,
    function (req, res, next) {
      let message = 'Roles and permissions created'
      rbac.setRole(req.app.locals.acl)
      req.app.locals.logger.info(message)
      res.send(message)
    }
  )
}
