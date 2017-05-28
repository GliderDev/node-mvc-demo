/**
 * Auth Helper module
 *
 * Used to Check Authentication and Authorization of user
 */

/**
 * Middleware ensures if the user is Authenticated and Authorized
 *
 * If not authorized then redirects to login page
 * and if not authorized then redirect back to dashboard
 *
 * @param {object}   req  HTTP request object
 * @param {object}   res  HTTP response object
 * @param {function} next Callback function
 */
module.exports.ensureAuth = function (req, res, next) {
  let locals = req.app.locals

  // Checks authentication
  if (req.isAuthenticated()) {
    let userId = req.user.user_id

    // gets the first route part of the url after domain name
    let resource = req.url !== '/'
                  ? req.url.slice(1).split('/')[0]
                  : '/'
    // let userPermission = ['view', 'create', 'edit']

    // Sets user image file and first name to global scope
    setUserInfo(req)

    // Checks if user has assigned any roles
    module.exports.hasAnyRole(
      locals,
      userId,
      '',
      function (err, hasRole) {
        if (err) {
          let errMessage = 'authHelper::ensureAuth : ' +
            'Sorry!, An error occurred while verifying access role'
          next(new Error(errMessage))
        }

        // checks 'view' permission, if user has any role
        if (hasRole) {
          locals.acl.isAllowed(
            userId,
            resource,
            'view',
            function (err, isAllowed) {
              if (err) {
                next(new Error(JSON.stringify(err)))
              }

              // Proceed to next middleware if allowed
              // else redirect to dashboard
              if (isAllowed) {
                next()
              } else {
                locals.logger.info({
                  case: 'Denied',
                  url: req.url,
                  userId: userId,
                  resource: resource,
                  permission: 'view',
                  isAllowed: isAllowed
                })

                req.flash(
                  'error',
                  "You're not authorized to do this action"
                )
                res.redirect('/')
              }
            }
          )
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
 * To check if the user has any role assigned to him
 *
 * Returns callback with err and role status
 *
 * @param  {object}   acl    Acl object
 * @param  {integer}  userId User Id
 * @param  {string}   role   Role to check
 * @return {function} resCb  Callback function
 */
module.exports.hasAnyRole = function (
  locals,
  userId,
  role = '',
  resCb
) {
  let acl = locals.acl
  let logger = locals.logger
  let errMessage = 'authHelper::hasAnyRole : ' +
    'Sorry!, An error occurred while verifying access role'

  if (!acl) {
    logger.error(
      'authHelper::hasAnyRole : acl is either undefined or null'
    )
    return resCb(true, null)
  }

  if (typeof (userId) === 'undefined' ||
      userId === null ||
      userId.length === 0
  ) {
    logger.error(
      'authHelper::hasAnyRole : userId is either undefined or null'
    )
    return resCb(true, null)
  }

  if (role === '') {
    // Checks access role for user
    module.exports.hasAnyRole(
      locals, userId, 'user',
      function (err, hasRole) {
        if (err) {
          logger.error(errMessage)
          return resCb(true, null)
        }

        if (hasRole) {
          return resCb(false, true)
        } else { // Checks access role for admin if has no user role
          module.exports.hasAnyRole(
            locals, userId, 'admin',
            function (err, hasRole) {
              if (err) {
                logger.error(errMessage)
                return resCb(true, null)
              }

              if (hasRole) {
                return resCb(false, true)
              } else {
                return resCb(false, false)
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
          'authHelper::hasAnyRole : error' + JSON.stringify(err)
        )
        return resCb(true, null)
      }

      if (hasRole) {
        return resCb(false, true)
      } else {
        return resCb(false, false)
      }
    })
  }
}
