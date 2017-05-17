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
    var csrfMiddleware = app.locals.csrfProtection
    , parseForm        = app.locals.parseForm
    , passport         = app.locals.passport;

    // HTTP GET - login route
    app.get(ctrlRoute + '/login', csrfMiddleware, function(req, res) {

        res.render( ctrlName + '/login', { 
            csrf: req.csrfToken() 
        });
    });

    // HTTP POST - login form process route
    app.post(
        ctrlRoute + '/login' 
        , passport.authenticate(
            'login'
            , { 
            failureRedirect: ctrlRoute + '/fail', // redirection path on fail
        })
        , parseForm
        , csrfMiddleware
        , function(req, res) {
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

    // HTTP GET - Register page
    app.get(ctrlRoute + '/register', csrfMiddleware, function(req, res) {
        res.render( ctrlName + '/register', { 
            csrf: req.csrfToken() 
        });
    });

    // HTTP GET - Forgot password page
    app.get(ctrlRoute + '/forgot', csrfMiddleware, function(req, res) {
        res.render( ctrlName + '/forgot', { 
            csrf: req.csrfToken() 
        });
    });

}; // End of Authorization Controller