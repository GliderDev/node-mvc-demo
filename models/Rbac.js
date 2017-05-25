/**
 * RBAC module
 *
 * This a RBAC Helper module to implement Authorization.
 *
 */


/**
 * setRole function
 *
 * Defines default site roles
 *
 * @param object acl ACL package object
 */
module.exports.setRole = function (acl) {
  // Define roles, resources and permissions
  acl.allow([
    {
      roles: 'admin',
      allows: [
        { resources: ['user', 'rbac'], permissions: ['*'] }
      ]
    }, {
      roles: 'user',
      allows: [
        { resources: ['/', 'categories'], permissions: ['view', 'create', 'edit'] }
      ]
    }
  ])

  // Inherit roles
  //  Every admin is allowed to do what users do
  acl.addRoleParents('admin', 'user')
  acl.addUserRoles(1, 'admin')
  acl.addUserRoles(2, 'user')
  acl.addUserRoles(3, 'user')
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
module.exports.assignRole = function (acl, userId, role = 'user', assignRoleCb) {
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
module.exports.removeRole = function (acl, userId, role = 'user', removeRoleCb) {
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
 * getUserRoles function
 *
 * To get roles assigned to the user
 *
 * @param  integer  userId  Id of the user
 * @return function cb      Callback function
 */
module.exports.getUserRoles = function (acl, userId, getUserRolesCb) {
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
      if (roles.length === 0) {
        return getUserRolesCb(false, 'none')
      } else if (roles.length === 1) {
        return getUserRolesCb(false, roles[0])
      } else if (roles.length > 1) {
        return getUserRolesCb(false, roles)
      }
    })
  }
}
