/*
 * CodeBase Controller
 *
 * This controller is used for the topics added by users and its functionalities
 */

var authHelper = require('../lib/authHelper')

// Creating categories model object
var codeBaseModel = require('.././models/Codebase')

module.exports.controller = function (app) {

  // Code base add Functionality
  app.get(
    '/codebase/add',
    authHelper.ensureAuth,
    codeBaseModel.addCodeBase
  )

  // Code base save Functionality
  app.post(
    '/codebase/save',
    authHelper.ensureAuth,
    codeBaseModel.saveCodeBase
  )

  // Get all Code base from table to Dashboard
  app.get(
    '/codebase/getCodebase',
    authHelper.ensureAuth,
    codeBaseModel.getCodeBase
  )

  app.get(
    '/codebase/getCodebase/:page',
    authHelper.ensureAuth,
    codeBaseModel.getCodeBase
  )

  // Edit Code base Functionality
  app.get(
    '/codebase/edit/:codebase_id',
    authHelper.ensureAuth,
    codeBaseModel.edit
  )

  // View Code base Functionality
  app.get(
    '/codebase/view/:codebase_id',
    authHelper.ensureAuth,
    codeBaseModel.viewCodebase
  )

  // To get the searched users for User Reference
  app.post(
    '/codebase/getSearchUsers',
    authHelper.ensureAuth,
    codeBaseModel.getSearchUsers
  )
}


