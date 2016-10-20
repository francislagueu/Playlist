var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var oauthflow = require('./routes/oauthflow');
var app = express();
<<<<<<< HEAD

var google = require('googleapis');

=======
//oct 13
var register = require('./routes/register'); //register page oct13
>>>>>>> master
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({secret:'team-583', saveUninitialized:false, resave:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', users);
<<<<<<< HEAD
app.use('/', routes);
app.use('/oauth', oauthflow);
app.use('/playlist', routes);

=======
app.use('/register', register); //register page oct13
>>>>>>> master
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


app.get('/', function (req, res) {
  res.send('Hello World!');
});
//clyde:  adding register.css oct13
app.use(express.static(__dirname+ '/public'))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
