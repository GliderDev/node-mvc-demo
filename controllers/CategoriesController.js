/*
 * Categories Controller
 *
 * This controller is used for the categories and its functionalities
 */

var path = require('path')

// Creating categories model object
var categoriesModel = require('.././models/Categories')

module.exports.controller = function (app) {
  // Categories Add Page
  app.get('categories/add', categoriesModel.add)

  // Categories Add Functionality
  app.post('categories/add', categoriesModel.save)

  // Categories View Page
  app.get('categories/view', categoriesModel.list)

  // Categories Edit Page
  app.get('categories/edit/:domain_id', categoriesModel.edit)

  // Categories Edit Page
  app.post('categories/edit/:domain_id', categoriesModel.save_edit)

  // Categories Delete functionality
  app.get('categories/delete/:domain_id', categoriesModel.delete_category)
}

 // End of Categories Controller
