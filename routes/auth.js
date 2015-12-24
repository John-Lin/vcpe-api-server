'use strict';
const debug = require('debug')('models');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let Token = require('../models/token.js');
let _ = require('lodash');

const config = require('config');
const hasJWTSecret = config.has('JWT.secret');

let securt = hasJWTSecret ? config.get('JWT.secret') : process.env.JWT_SECRET;

/* GET root route. */
router.get('/', (req, res) => {
  res.json({
    result: 'Hello, this is vCPE API Server!',
  });
});

/* POST /auth/login */
router.post('/auth/login', (req, res) => {
  req.accepts(['application/json']);
  let username = req.body.username;
  let password = req.body.password;

  Token
    .query(username)
    .where('password').equals(password)
    .exec((err, resp) => {
      if (err) debug(err);
      if (resp.Count === 0) {
        res.sendStatus(401);
      } else {
        let user = {
          username: (_.pluck(resp.Items, 'attrs'))[0].username,
          password: (_.pluck(resp.Items, 'attrs'))[0].password,
        };
        let token = jwt.sign(user, securt);

        Token.update({
          username: user.username,
          password: user.password,
          token: token,
        }, function(err, t) {
          if (err) debug(err);
          // console.log('added token', t.get('token'));
        });

        res.json({token: token});
      }
    });
});
module.exports = router;
