'use strict';
const debug = require('debug')('models');
let express = require('express');
let _ = require('lodash');
let Account = require('../models/user.js');
let router = express.Router();

/*
 * POST to create an user.
 */
router.post('/accounts', (req, res) => {
  req.accepts(['application/json']);

  if (!(req.body.email && req.body.username)) {
    res.sendStatus(400);
    return;
  }

  let params = {
    email: req.body.email,
    username: req.body.username,
    settings: {
      container: {
        id: 'c01b39c7a35ccc3b081a3e83d2c71fa9a767ebfeb45c6',
        name: 'mycontainer',
      },
      router: {
        currentState: 'OFF',
        wanPort: 1,
        publicIP: '140.114.99.189',
        defultGateway: '140.114.99.254',
        localNetwork: '192.168.8.0',
      },
    },
  };

  // By default overwrite is set to true,
  // allowing create operations to overwrite existing records
  Account.create(params, (err, acc) => {
    if (err) debug(err);
    debug(`${acc.get('email')} created an account at ${acc.get('createdAt')}`);
    res.status(201).json({
      uuid: acc.get('vCPEID'),
    });
  });

});

/*
 * GET to get a single user data.
 */
router.get('/:username', (req, res) => {
  req.accepts(['application/json']);
  let username = req.params.username;
  Account
    .query(username)
    .exec((err, resp) => {
      if (err) debug(err);

      if (resp.Count === 0) {
        res.sendStatus(204);
        return;
      }

      res.status(200).json({
        uuid: (_.pluck(resp.Items, 'attrs'))[0].vCPEID,
        email: (_.pluck(resp.Items, 'attrs'))[0].email,
        username: (_.pluck(resp.Items, 'attrs'))[0].username,
        settings: (_.pluck(resp.Items, 'attrs'))[0].settings,
      });
    });
});

module.exports = router;
