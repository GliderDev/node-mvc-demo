/*
 * User Controller
 *
 * This controller is used group user and its functionalities
 *
 */
var authHelper = require('../lib/authHelper')

// Creating User model object
var userModel = require('.././models/Users')

module.exports.controller = function (app) {
    // Users Add Page
  app.get(
    '/users/add',
    authHelper.ensureAuth,
    userModel.add
  )

    // Users Add Functionality
  app.post(
    '/users/add',
    authHelper.ensureAuth,
    userModel.save
  )

    // Users View Page
  app.get(
    '/users/view',
    authHelper.ensureAuth,
    userModel.list
  )

    // Users Delete Functionality
  app.get(
    '/users/delete/:user_id',
    authHelper.ensureAuth,
    userModel.delete
  )

  // Users Edit Page
  app.get(
    '/users/edit/:user_id',
    authHelper.ensureAuth,
    userModel.edit
  )

  // Users Edit Functionality
  app.post(
    '/users/edit/:user_id',
    authHelper.ensureAuth,
    userModel.save_edit
  )
}
// End of User Controller
