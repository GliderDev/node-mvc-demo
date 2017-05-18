/**
 * RBAC module
 *
 * This a RBAC Helper module to implement Authorization.
 *
 */

var Sequelize = require('sequelize')
var Acl = require('acl')
var AclSeq = require('acl-sequelize')

var db = new Sequelize('dmcoderepo', 'root', 'pass')
var acl = new Acl(new AclSeq(db, { prefix: 'acl_' }))

/**
 * setRole function
 *
 * Defines default site roles
 *
 * @param object acl ACL package object
 */
exports.setRole = function () {
  // Define roles, resources and permissions
  acl.allow([
    {
      roles: 'admin',
      allows: [
        { resources: '/', permissions: '*' }
      ]
    }, {
      roles: 'user',
      allows: [
        { resources: '/', permissions: ['view', 'create', 'edit'] }
      ]
    }, {
      roles: 'guest',
      allows: [
        { resources: 'auth', permissions: 'view' }
      ]
    }
  ])

  // Inherit roles
  //  Every user is allowed to do what guests do
  //  Every admin is allowed to do what users do
  acl.addRoleParents('user', 'guest')
  acl.addRoleParents('admin', 'user')
}

/**
 * checkAccess function
 *
 * To check if the user have access to given route with
 * given permission.
 *
 * @param  object   acl        ACL middleware object
 * @param  integer  userId     Id of the user
 * @param  string   resources  Route to check the access
 * @param  string   permission Type of permission to check
 * @return function cb         Callback function
 */
exports.checkAccess = function (acl, userId, resources, permission, cb) {
  // Add / if not given
  if (resources[0] !== '/') {
    resources = '/' + resources
  }

  acl.isAllowed(userId, resources, permission, function (err, res) {
    if (err) {
      return (err, null)
    }

    if (res) {
      return cb(null, true)
    } else {
      return cb(null, false)
    }
  })
}

/**
 * assignRole function
 *
 * To assign a user to a role
 *
 * @param  object   acl    ACL middleware object
 * @param  integer  userId Id of the user
 * @param  string   role   Role to assign user
 * @return function cb     Callback function
 */
exports.assignRole = function (acl, userId, role = 'user', assignRoleCb) {
  if (typeof (acl) === 'undefined') {
    return assignRoleCb('ACL object not passed', false)
  } else if (typeof (userId) === 'undefined') {
    return assignRoleCb('User ID not passed', false)
  } else {
    try {
      acl.addUserRoles(userId, role)
      assignRoleCb(null, true)
    } catch (err) {
      assignRoleCb(err, false)
    }
  }
}

/**
 * removeRole function
 *
 * To remove an assigned role of a user
 * 
 * @param  object   acl    ACL middleware object
 * @param  integer  userId Id of the user
 * @param  string   role   Role to assign user
 * @return function cb     Callback function
 */
exports.removeRole = function (acl, userId, role = 'user', removeRoleCb) {
  if (typeof (acl) === 'undefined') {
    return removeRoleCb('ACL object not passed', false)
  } else if (typeof (userId) === 'undefined') {
    return removeRoleCb('User ID not passed', false)
  } else {
    try {
      acl.removeUserRoles(userId, role)
      removeRoleCb(null, true)
    } catch (err) {
      removeRoleCb(err, false)
    }
  }
}

/**
 * ensureAuthorization function
 *
 * To check if a given user is Authorized or not
 *
 * @param  integer  userId  Id of the user
 * @return function cb      Callback function
 */
exports.ensureAuthentication = function (
  req,
  res,
  ensureAuthCb
) {
  if (req.isAuthenticated()) {
    ensureAuthCb(false)
  } else {
    ensureAuthCb(true)
  }
}

/**
 * getUserRoles function
 *
 * To get roles assigned to the user
 *
 * @param  integer  userId  Id of the user
 * @return function cb      Callback function
 */
exports.getUserRoles = function (acl, userId, getUserRolesCb) {
  if (typeof (acl) === 'undefined') {
    return getUserRolesCb('ACL object not passed', false)
  } else if (typeof (userId) === 'undefined') {
    return getUserRolesCb('User ID not passed', false)
  } else {
    acl.userRoles(userId, function (error, roles) {
      // Return error if present
      if (error) {
        return getUserRolesCb(error, false)
      }

      // Return role
      if (roles.length == 0) {
        return getUserRolesCb(false, 'none')
      } else if (roles.length == 1) {
        return getUserRolesCb(false, roles[0])
      } else if (roles.length > 1) {
        return getUserRolesCb(false, roles)
      }
    })
  }
}
