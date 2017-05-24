/*
 * Categories Controller
 *
 * This controller is used for the categories and its functionalities
 */

var path = require('path')
var auth = require('../models/Auth')

// Creating categories model object
var categoriesModel = require('.././models/Categories')

module.exports.controller = function (app) {
  // Categories Add Page

  app.get('/categories/add', auth.ensureLogin, categoriesModel.add)

  // Categories Add Functionality
  app.post('/categories/add', auth.ensureLogin, categoriesModel.save)

  // Categories View Page
  app.get('/categories/view', auth.ensureLogin, categoriesModel.list)

  // Categories Edit Page
  app.get('/categories/edit/:domain_id', auth.ensureLogin, categoriesModel.edit)

  // Categories Edit Page
  app.post('/categories/edit/:domain_id', auth.ensureLogin, categoriesModel.save_edit)

  // Categories Delete functionality
  app.get('/categories/delete/:domain_id', auth.ensureLogin, categoriesModel.delete_category)

  app.get('/categories/create', auth.ensureLogin, categoriesModel.create_category)

  app.post('/categories/create', auth.ensureLogin, categoriesModel.save_category)
}

 // End of Categories Controller
