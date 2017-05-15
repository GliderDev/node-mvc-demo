var path     = require('path');
var filename = path.basename(__filename).split('.')[0];

var categoriesModel = require('.././models/categories'); 

module.exports.controller = function(app) {
  

 	app.get('/'+ filename + '/add', categoriesModel.add);

 	app.post('/'+ filename +'/add', categoriesModel.save);

 	app.get('/'+ filename + '/view', categoriesModel.list);  

 	app.get('/'+ filename + '/edit/:domain_id', categoriesModel.edit);

    app.post('/'+ filename + '/edit/:domain_id', categoriesModel.save_edit);

    app.get('/'+ filename + '/delete/:domain_id', categoriesModel.delete_category);

}; // End of Student Controller