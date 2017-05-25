/*
 * Categories Controller
 *
 * This controller is used for the categories and its functionalities
 */

var path = require('path')
var authHelper = require('../lib/authHelper')

// Creating categories model object
var categoriesModel = require('.././models/Categories')

module.exports.controller = function (app) {
  // Categories Add Page

  app.get(
    '/categories/add',
    authHelper.ensureAuth,
    categoriesModel.add
  )

  // Categories Add Functionality
  app.post(
    '/categories/add',
    authHelper.ensureAuth,
    categoriesModel.save
  )

  // Categories View Page
  app.get(
    '/categories/view',
    authHelper.ensureAuth,
    categoriesModel.list
  )

  // Categories Edit Page
  app.get(
    '/categories/edit/:domain_id',
    authHelper.ensureAuth,
    categoriesModel.edit
  )

  // Categories Edit Page
  //app.post(
  //   '/categories/edit/:domain_id',
  //   authHelper.ensureAuth,
  //   categoriesModel.saveEdit
  // )

  // Categories Delete functionality
  app.get(
    '/categories/delete/:domain_id',
    authHelper.ensureAuth,
    categoriesModel.deleteCategory
  )

  app.get(
    '/categories/create',
    authHelper.ensureAuth,
    categoriesModel.createCategory
  )

  app.post(
    '/categories/create',
    authHelper.ensureAuth, 
    categoriesModel.saveCategory
  )

  app.post(
    '/categories/sub_category',
    authHelper.ensureAuth,
    categoriesModel.getSubCategory
  )
}

 // End of Categories Controller
