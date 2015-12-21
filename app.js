'use strict';
let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');

let routes = require('./routes/index.js');
let users = require('./routes/users.js');
let settings = require('./routes/settings.js');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  next();
});

app.use('/api/v1', routes);
app.use('/api/v1/users', users);
app.use('/api/v1/settings', settings);

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
