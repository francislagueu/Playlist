var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var oauthflow = require('./routes/oauthflow');
var spotifyauth=require('./routes/spotifyauth');
var home = require('./routes/home');

//var register = require('./routes/register'); //register page oct13
var mongoose = require('mongoose');  //oct 24
var google = require('googleapis');
//var login = require('./routes/login')// login routing?  oct23

 var env = process.env.NODE_ENV = process.env.NODE_ENV || 'production';
var config = require('./config/database')[env];
//oct 13
mongoose.connect(config.url);  //oct 24
var db = mongoose.connection;
// view engine setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:'team-583', saveUninitialized:false, resave:false}));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value:value
        };
    }
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);
//app.use('/register', register); //register page oct13
app.use('/home', home);

app.use('/oauth', oauthflow);
app.use('/playlist', routes);
app.use('/spotify', spotifyauth);
//app.use('/login', login);  //login page oct 23

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });




module.exports = app;
