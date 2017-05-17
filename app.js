/**
 * app.js
 * 
 * Application Configuration file
 */

// Including extra Packages
var http                = require('http')
    , express           = require('express')
    , mysql             = require('mysql')
    , connection        = require('express-myconnection')
    , path              = require('path')
    , fs                = require('fs')
    , cookieParser      = require('cookie-parser')
    , session           = require('express-session')
    , bodyParser        = require('body-parser')
    , csrf              = require('csurf')
    , passport          = require('passport')
    , LocalStrategy     = require('passport-local')
    , expressFileUpload = require('express-fileupload')
    , dateTime          = require('node-datetime')
    , Sequelize         = require('sequelize');

// Including local modules
var userModel = require('./models/User');


// Configuring  csrf and bodyParser middlewares 
var csrfProtection   = csrf({ cookie: true });
var parseForm        = bodyParser.urlencoded({ extended: false });

// ======================== Sequelize ORM Configuring ========================

var User   = require('./models/orm/User');
var Domain = require('./models/orm/Domain');

/*User.findOne().then(function(res){
  console.log(res.user_id);
  console.log(res.first_name);
  console.log(res.last_name);
});

Domain.findOne().then(function(res){
  console.log(res.domain_id);
  console.log(res.domain);
  console.log(res.description);
});*/


// ======================== Authorization Configuration ========================
// Configuring the local strategy for use by Passport.
passport.use('login', new LocalStrategy({
    passReqToCallBack: true
},
function(username, password, cb) {
        userModel.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        }
    );
}));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    userModel.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

// Creating express object
var app = express();

// Sets Port number as 3000 if not provided
app.set('port', process.env.PORT || 3000);

// Sets View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


// use domains for better error handling
app.use(function(req, res, next){
    // create a domain for this request
    var domain = require('domain').create();

    // handle errors on this domain
    domain.on('error', function(err){
        console.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            // failsafe shutdown in 5 seconds
            setTimeout(function(){
                console.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);

            // stop taking new requests
            server.close();

            try {
                // attempt to use Express error route
                next(err);
            } catch(error){
                // if Express error route failed, try
                // plain Node response
                console.error('Express error mechanism failed.\n', error.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch(error){
            console.error('Unable to send 500 response.\n', error.stack);
        }
    });

    // add the request and response objects to the domain
    domain.add(req);
    domain.add(res);

    // execute the rest of the request chain in the domain
    domain.run(next);
});

//Adding th public folder as static flder to server css, js and images files
app.use(express.static(path.join(__dirname, 'public')));


// Database connection string
app.use(
    
    connection(mysql,{
        
        host     : 'localhost',
        user     : 'root',
        password : 'pass',
        port     : 3306, 
        database : 'dmcoderepo'

    }) 

);



// Adding CSRF middleware
app.use(cookieParser());

app.use(session({
    secret: 'pass'
    , resave: true
    , saveUninitialized: true

}));

app.locals.csrfProtection = csrfProtection;
app.locals.parseForm        = parseForm;
//app.locals.parseFileUploads = parseFileUploads;
app.use(parseForm);
app.use(expressFileUpload())

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.locals.passport = passport;

// flash message middleware
app.use(require('flash')());
app.use(function(req, res, next){
    // if there's a flash message, transfer
    // it to the context, then clear it
    //res.locals.flash = req.session.flash;
    if ( req.session.flash ) {
        delete req.session.flash;
    }
    
    next();
});


// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


// Creating Server Instance
http.createServer(app).listen(app.get('port'), function(){
  console.log( 'Express started in ' + app.get('env') +
    ' mode on http://localhost:' + app.get('port') +
    '; press Ctrl-C to terminate.' );
});