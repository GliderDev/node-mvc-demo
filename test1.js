/**
 * Simple node_acl example with mongoDB and expressjs
 *
 * Usage:
 *  1. Start this as server
 *  2. Play with the resoures
 *
 *     Show all permissions (as JSON)
 *      http://localhost:3500/info
 *
 *     Only visible for users and higher
 *      http://localhost:3500/secret
 *
 *     Only visible for admins
 *      http://localhost:3500/topsecret
 *
 *     Manage roles
 *     user is 'bob' and role is either 'guest', 'user' or 'admin'
 *      http://localhost:3500/allow/:user/:role
 *      http://localhost:3500/disallow/:user/:role
 *
 * Don't forget to disallow a role, if you want to revoke its
 *  permissions.
 */

var express = require( 'express' ),
    acl = require( 'acl' ),
    session       = require('express-session')
    port = 3500,
    app = express(),
    Sequelize     = require('sequelize'),
    mysql         = require('mysql');

// Configuring Database for Sequelize
var sequelize = new Sequelize('test', 'root', 'pass');

// Defining Model
var User = sequelize.define('users', {
    id : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING, allowNull: false},
    password: {type: Sequelize.STRING, allowNull: false}
},{ 
    timestamps: false,
    freezeTableName: true
});

User.findOne().then(function(res){
    console.log(res.id);
    console.log(res.username);
    console.log(res.password);
});

User.findAll().then(function(res){
        let k = JSON.stringify(res);
        console.log(k);
});

sequelize.authenticate().then(function(err){
    console.log('Connection Established Successfully');
}).catch(function(err){
    console.log('Unable to connect to the database', err);
});

// Error handling ( most notably 'Insufficient permissions' )
//app.use( app.router );
app.use( function( error, request, response, next ) {
    if( !error ) return next();
    response.send( error.msg, error.errorCode );
});

app.use(session({
    secret: 'sessionPassword' // for encrypting cookie session
    , resave: true
    , saveUninitialized: true

}));

app.use(require('flash')());

acl = new acl(new acl.memoryBackend());

// RBAC Model
var rbac = require('./lib/rbac1');
app.locals.acl = acl;
rbac.setRole(acl);
set_routes();

// Defining routes ( resources )
function set_routes() {

    // Simple overview of granted permissions
    app.get( '/info',
        function( request, response, next ) {
            
            // Showing flash messages
            var flash = request.session.flash;
            if ( flash.length > 0 ) {
                for (var i = 0; i < flash.length; i++) {
                    console.log(flash[i].message);
                }
            }

            acl.allowedPermissions( get_user_id(), [ '/info', '/secret', '/topsecret' ], function( error, permissions ){
                response.json( permissions );
            });
        }
    );

    // Only for users and higher
    app.get( '/secret', acl.middleware( 1, get_user_id ),
        function( request, response, next ) {
            response.send( 'Welcome Sir!' );
        }
    );

    // Only for admins
    app.get( '/topsecret', acl.middleware( 1, get_user_id ),
        function( request, response, next ) {
            response.send( 'Hi Admin!' );
        }
    );

    // Is allowed
    app.get( '/test', function( request, response ) {
        // Checks if user has create access
        acl.isAllowed( get_user_id(), '/secret', 'get', function(err, res){
            if ( res ) {
                response.json(res);
            } else {
                response.json(err);
            }
        });
    }); 
    // Is allowed
    app.get( '/foo/bar', 
        checkAuth,
        function( request, response ) {
        
        response.send('ok');
    });

    // Setting a new role
    app.get( '/allow/:user/:role', function( request, response, next ) {
        acl.addUserRoles( request.params.user, request.params.role );
        response.send( request.params.user + ' is a ' + request.params.role );
    });

    // Unsetting a role
    app.get( '/disallow/:user/:role', function( request, response, next ) {
        acl.removeUserRoles( request.params.user, request.params.role );
        response.send( request.params.user + ' is not a ' + request.params.role + ' anymore.' );
    });
}

// Provide logic for getting the logged-in user
//  This is a job for your authentication layer
function get_user_id( request, response ) {
    return 'bob';
}

// Generic debug logger for node_acl
function logger() {
    return {
        debug: function( msg ) {
            console.log( '-DEBUG-', msg );
        }
    };
}

function ensureAuthenticated(req, res, next)
{
    rbac.checkAccess(req.app.locals.acl, get_user_id(), req.url, 'get', function(err, isAllowed){
        console.log(isAllowed);
    });
    next();
}

// Starting the server
app.listen( port, function() {
    console.log( 'ACL example listening on port ' + port );
});

function checkAuth(req, res, next){    
    rbac.ensureAuthorization(
        req, 
        res, 
        next,
        app.locals.acl,
        get_user_id()
    )
}