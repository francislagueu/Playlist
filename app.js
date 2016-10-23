var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var oauthflow = require('./routes/oauthflow');
var spotifyauth=require('./routes/spotifyauth');

var register = require('./routes/register'); //register page oct13

var google = require('googleapis');

var app = express();

//oct 13

var register = require('./routes/register'); //register page oct13
var clydeindex = require('./routes/clydeindex') //other index page oct 21



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret:'team-583', saveUninitialized:false, resave:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/users', users);
app.use('/register', register); //register page oct13

app.use('/clydeindex', clydeindex) // clydeindex page oct 21

app.use('/', routes);
app.use('/oauth', oauthflow);
app.use('/playlist', routes);
app.use('/spotify', spotifyauth);


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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
