/*
 * Student Controller
 *
 * This controller is used group student routes
 */

// gets controller name and relative path
var path      = require('path');
var ctrlName  = path.basename(__filename).split('.')[0].toLowerCase();
var ctrlRoute = '/'+ctrlName;


module.exports.controller = function(app) {
  
    // Student View Page
    app.get(ctrlRoute + '/view', function(req, res) {
        res.render( ctrlName + '/view', { title: 'Student List' });
    });

    // Student Add Page
    app.get(ctrlRoute + '/add', function(req, res) {
        res.render( ctrlName + '/view', { title: 'Add Student' });
    });

    app.post(ctrlRoute + '/add', function(req, res) {
        
    });

}; // End of Student Controller