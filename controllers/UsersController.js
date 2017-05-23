/*
 * User Controller
 *
 * This controller is used group user and its functionalities
 *
 */

var path = require('path')
var auth = require('../models/Auth')


// Creating User model object
var userModel = require('.././models/Users')

module.exports.controller = function (app) {
    // Users Add Page
  app.get('/users/add', auth.ensureLogin, userModel.add)

    // Users Add Functionality
  app.post('/users/add', auth.ensureLogin, userModel.save)

    // Users View Page
  app.get('/users/view', auth.ensureLogin, userModel.list)

    // Users Delete Functionality
  app.get('/users/delete/:user_id',
        auth.ensureLogin, userModel.delete
    )

    // Users Edit Page
  app.get('/users/edit/:user_id', auth.ensureLogin, userModel.edit)

    // Users Edit Functionality
  app.post('/users/edit/:user_id', auth.ensureLogin, userModel.save_edit)
}
// End of User Controller
