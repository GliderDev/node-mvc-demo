/*
 * Categories Controller
 *
 * This controller is used for the categories and its functionalities
 */

var path = require('path')
var authHelper = require('../lib/authHelper')
var paginate = require('express-paginate')

// Creating categories model object
var categoriesModel = require('.././models/Categories')

module.exports.controller = function (app) {
  // Categories Add Page

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

  app.post(
    '/categories/sub_cat_create',
    authHelper.ensureAuth,
    categoriesModel.saveSubCategory
  )

  app.get(
    '/categories/approve/:domain_id',
    authHelper.ensureAuth,
    categoriesModel.changeToApprove
  )

  app.get(
    '/categories/reject/:domain_id',
    authHelper.ensureAuth,
    categoriesModel.changeToReject
  )

  // app.get(
  //   '/categories/getList',
  //   authHelper.ensureAuth,
  //   categoriesModel.getCategoryList
  // )
}

 // End of Categories Controller
