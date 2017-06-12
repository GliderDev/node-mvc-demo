/*
 * Categories Controller
 *
 * This controller is used for the categories and its functionalities
 */

var authHelper = require('../lib/authHelper')

// Creating categories model object
var categoriesModel = require('.././models/Categories')

module.exports.controller = function (app) {
  // Categories Add Page

  app.get(
    '/categories/create',
    authHelper.ensureAuth,
    categoriesModel.createCategory
  )

  app.get(
    '/categories/create/:page',
    authHelper.ensureAuth,
    categoriesModel.createCategory
  )

  app.post(
    '/categories/create',
    authHelper.ensureAuth,
    categoriesModel.saveCategory
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
}

 // End of Categories Controller
