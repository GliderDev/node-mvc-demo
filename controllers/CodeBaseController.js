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
}


