/*
 * Customer Controller
 *
 * This controller is used group customer and its functionalities
 *  
 */

var path = require('path');
var filename = path.basename(__filename).split('.')[0];


// Creating Customer model object
var customersModel = require('.././models/customers');

module.exports.controller = function (app) {

    // Customers Add Page
    app.get('/' + filename + '/add', customersModel.add);

    // Customers Add Functionality
    app.post('/' + filename + '/add', customersModel.save);

    // Customers View Page
    app.get('/' + filename + '/view', customersModel.list);

    // Customers Delete Functionality
    app.get('/' + filename + '/delete/:user_id', 
        customersModel.delete_customer
    );

    // Customers Edit Page
    app.get('/' + filename + '/edit/:user_id', customersModel.edit);

    // Customers Edit Functionality
    app.post('/' + filename + '/edit/:user_id', customersModel.save_edit);

};
// End of Customer Controller