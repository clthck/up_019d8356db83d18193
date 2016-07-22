var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');

var routes = require('./routes/index');
var page = require('./routes/page');
var admin = {
  index:            require('./routes/admin/index'),
  location_files:   require('./routes/admin/location_files'),
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(stormpath.init(app, {}));

var injectGroupName = (req, res, next) => {
  if (req.user == undefined) return next();
  
  req.user.groupNames = [];
  req.user.getGroups((err, groups) => {
    if (err) return next(err);
    groups.each((group, cb) => {
      req.user.groupNames.push(group.name);
      cb();
    }, (err) => {
      if (err) return next(err);
    });
  });
  next();
}

app.use(stormpath.getUser, injectGroupName);

app.use('/json_results', express.static(path.join(__dirname, 'public/json_results')));
app.use('/', stormpath.loginRequired, routes);
app.use('/page', stormpath.loginRequired, page);
app.use('/admin', stormpath.groupsRequired(['administrators']), admin.index);
app.use('/admin/location-files', stormpath.groupsRequired(['administrators']), admin.location_files);

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
