'use strict';
let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let expressJwt = require('express-jwt');
const config = require('config');
const hasJWTSecret = config.has('JWT.secret');

let routes = require('./routes/index.js');
let auth = require('./routes/auth.js');
let users = require('./routes/users.js');
let settings = require('./routes/settings.js');

let authenticate = hasJWTSecret ?
  expressJwt({secret: config.get('JWT.secret')}) :
  expressJwt({secret: process.env.JWT_SECRET});

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// return 401 when no authorization
app.use('/api', authenticate, (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized or invalid token.');
  }
});

app.use((req, res, next) => {
  next();
});

app.use('/', auth);
app.use('/api/v1', routes);
app.use('/api/v1/users', users);
app.use('/api/v1/settings', settings);

module.exports = app;
