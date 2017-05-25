// Authentication and Authorization Checks

module.exports.ensureAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    setUserInfo(req) // Sets user info to globally
    module.exports.checkAccess(
      req.app.locals,
      req.user.user_id,
      '',
      function (err, hasRole) {
        if (err) {
          let errMessage = 'authHelper::ensureAuth : ' +
            'Sorry!, An error occurred while verifying access role'
          next(new Error(errMessage))
        }

        if (hasRole) {
          next()
        } else {
          next(new Error('Role not found!'))
        }
      })
  } else {
    res.redirect('/auth/login')
  }
}

/**
 * Sets uses image and first name to global variable
 * @param {object} req
 */
function setUserInfo (req) {
  if (req.user.profile_pic !== null) {
    req.app.locals.profileImage = req.user.profile_pic
  } else { // Default image
    req.app.locals.profileImage = 'user_avatar.png'
  }

  // Sets uses user first name to global variable
  req.app.locals.userFirstName = req.user.first_name
}

/**
 * To check the given access role against given user id
 * Returns true if user has role, else returns false
 * @param  {object}  acl
 * @param  {integer} userId
 * @param  {string}  role
 * @return {boolean}
 */
module.exports.checkAccess = function (
  locals,
  userId,
  role = '',
  responseCallback
) {
  let acl = locals.acl
  let logger = locals.logger
  let errMessage = 'authHelper::checkAccess : ' +
    'Sorry!, An error occurred while verifying access role'

  if (!acl) {
    logger.error(
      'authHelper::checkAccess : acl is either undefined or null'
    )
    return responseCallback(true, null)
  }

  if (typeof (userId) === 'undefined' ||
      userId === null ||
      userId.length === 0
  ) {
    logger.error(
      'authHelper::checkAccess : userId is either undefined or null'
    )
    return responseCallback(true, null)
  }

  if (role === '') {
    // Checks access role for user
    module.exports.checkAccess(
      locals, userId, 'user',
      function (err, hasRole) {
        if (err) {
          logger.error(errMessage)
          return responseCallback(true, null)
        }

        if (hasRole) {
          return responseCallback(false, true)
        } else { // Checks access role for admin if has no user role
          module.exports.checkAccess(
            locals, userId, 'admin',
            function (err, hasRole) {
              if (err) {
                logger.error(errMessage)
                return responseCallback(true, null)
              }

              if (hasRole) {
                return responseCallback(false, true)
              } else {
                return responseCallback(false, false)
              }
            }
          )
        }
      }
    )
  } else {
    acl.hasRole(userId, role, function (err, hasRole) {
      if (err) {
        logger.error(
          'authHelper::checkAccess : error' + JSON.stringify(err)
        )
        return responseCallback(true, null)
      }

      if (hasRole) {
        return responseCallback(false, true)
      } else {
        return responseCallback(false, false)
      }
    })
  }
}
