/*
 * User Controller
 *
 * This controller is used group user and its functionalities
 *  
 */

var path = require('path');
var filename = path.basename(__filename).split('.')[0];


// Creating User model object
var userModel = require('.././models/users');

module.exports.controller = function (app) {

    // Users Add Page
    app.get('/' + filename + '/add', userModel.add);

    // Users Add Functionality
    app.post('/' + filename + '/add', userModel.save);

    // Users View Page
    app.get('/' + filename + '/view', userModel.list);

    // Users Delete Functionality
    app.get('/' + filename + '/delete/:user_id', 
        userModel.delete
    );

    // Users Edit Page
    app.get('/' + filename + '/edit/:user_id', userModel.edit);

    // Users Edit Functionality
    app.post('/' + filename + '/edit/:user_id', userModel.save_edit);

};
// End of User Controller