/*
 * Student Controller
 *
 * This controller is used group student routes
 */
var path     = require('path');
var filename = path.basename(__filename).split('.')[0];

var multer   = require('multer');
var uploads  = multer({'dest':'public/uploads'});

var customersModel = require('.././models/customers'); 

module.exports.controller = function(app) {
  

 	app.get('/'+ filename + '/add', customersModel.add);

    app.post('/'+ filename +'/add', uploads.any(),customersModel.save);

    app.get('/'+ filename + '/view', customersModel.list);

    app.get('/'+ filename + '/delete/:id', customersModel.delete_customer);

    app.get('/'+ filename + '/edit/:user_id', customersModel.edit);

    app.post('/'+ filename + '/edit/:user_id', customersModel.save_edit);

}; // End of Student Controller