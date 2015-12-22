'use strict';
const debug = require('debug')('models-users');
let express = require('express');
let util = require('util');
let _ = require('lodash');
let Account = require('../models/user.js');
let router = express.Router();

/*
 * POST to create an user.
 */
router.post('/signup', (req, res) => {
  req.accepts(['application/json']);

  if (!(req.body.email && req.body.name)) {
    res.sendStatus(400);
    return;
  }

  let params = {
    email: req.body.email,
    name: req.body.name,
    settings: {
      containerid: 'c01b39c7a35ccc3b081a3e83d2c71fa9a767ebfeb45c6',
      nickname: 'mycontainer',
      router: {
        routerStatus: 'OFF',
        routerWANPort: 1,
        routerPublicIP: '140.114.99.189',
        routerDefultGateway: '140.114.99.254',
        routerLocalNetwork: '192.168.8.0',
      },
    },
  };

  // By default overwrite is set to true,
  // allowing create operations to overwrite existing records
  Account.create(params, (err, acc) => {
    if (err) debug(err);
    debug(`${acc.get('email')} created an account at ${acc.get('createdAt')}`);
    res.status(201).json({
      uuid: acc.get('vCPEUUID'),
    });
  });

});

/*
 * GET to get a single user data.
 */
router.get('/:id', (req, res) => {
  req.accepts(['application/json']);
  let uuid = req.params.id;
  Account
    .scan()
    .where('vCPEUUID').equals(uuid)
    .exec((err, resp) => {
      if (err) debug(err);

      if (resp.Count === 0) {
        res.sendStatus(204);
        return;
      }

      res.status(200).json({
        uuid: uuid,
        email: (_.pluck(resp.Items, 'attrs'))[0].email,
        name: (_.pluck(resp.Items, 'attrs'))[0].name,
      });
    });

});

module.exports = router;
