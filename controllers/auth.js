/*
 * Authorization Controller
 *
 * This controller is used for user authorization
 */

// gets controller name and relative path
var path      = require('path');
var ctrlName  = path.basename(__filename).split('.')[0].toLowerCase();
var ctrlRoute = '/'+ctrlName;

// Creating User model object
var userModel = require('../models/userModel');



// Module definition
module.exports.controller = function(app) {
    
    // app local scope variable definition
    var csrfValidation = app.locals.csrfProtection;
    var parseForm = app.locals.parseForm;
    var passport  = app.locals.passport;

    // HTTP GET - login route
    app.get(ctrlRoute + '/login', csrfValidation, function(req, res) {

        res.render( ctrlName + '/login', { 
            csrf: req.csrfToken() 
        });

    });

    // HTTP POST - login form process route
    app.post(ctrlRoute + '/login', 
        passport.authenticate('login', { 
            failureRedirect: ctrlRoute + '/fail', // redirection path on fail
        }), 
        parseForm, 
        csrfValidation, 
        function(req, res) {
            res.redirect('/');
        }
    );

    // HTTP GET - logout route
    app.get(ctrlRoute + '/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    }); 

    // HTTP GET - logout route
    app.get(ctrlRoute + '/fail', function(req, res) {
        res.render( ctrlName + '/fail');
    });

     app.get(ctrlRoute + '/register', function(req, res) {
        res.render( ctrlName + '/register');
    });







}; // End of Authorization Controller