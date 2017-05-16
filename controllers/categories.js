/*
 * Categories Controller
 *
 * This controller is used for the categories and its functionalities
 */


var path     = require('path');
var filename = path.basename(__filename).split('.')[0];

// Creating categories model object
var categoriesModel = require('.././models/categories'); 

module.exports.controller = function(app) {
  
	// Categories Add Page
 	app.get('/'+ filename + '/add', categoriesModel.add);
	
	// Categories Add Functionality
 	app.post('/'+ filename +'/add', categoriesModel.save);

	// Categories View Page
 	app.get('/'+ filename + '/view', categoriesModel.list);  

 	// Categories Edit Page
 	app.get('/'+ filename + '/edit/:domain_id', categoriesModel.edit);

	// Categories Edit Page
    app.post('/'+ filename + '/edit/:domain_id', categoriesModel.save_edit);

	// Categories Delete functionality
    app.get('/'+ filename + '/delete/:domain_id', categoriesModel.delete_category);

};


 // End of Categories Controller