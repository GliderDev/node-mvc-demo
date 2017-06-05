/*
 * CodeBase Controller
 *
 * This controller is used for the topics added by users and its functionalities
 */

var authHelper = require('../lib/authHelper')

// Creating categories model object
var codeBaseModel = require('.././models/Codebase')

module.exports.controller = function (app) {
  app.get(
    '/codebase/add',
    authHelper.ensureAuth,
    codeBaseModel.addCodeBase
  )

  app.post(
    '/codebase/save',
    authHelper.ensureAuth,
    codeBaseModel.saveCodeBase
  )

  app.get(
    '/codebase/getCodebase',
    authHelper.ensureAuth,
    codeBaseModel.getCodeBase
  )

  app.get(
    '/codebase/edit/:codebase_id',
    authHelper.ensureAuth,
    codeBaseModel.edit
  )

  app.get(
    '/codebase/view/:codebase_id',
    authHelper.ensureAuth,
    codeBaseModel.viewCodebase
  )
}


