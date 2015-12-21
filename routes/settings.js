'use strict';
const debug = require('debug')('models-settings');
let express = require('express');
let util = require('util');
let _ = require('lodash');
let Account = require('../models/user.js');
let router = express.Router();

/*
 * PUT to update(turn on/off) NAT status.
 */
router.put('/router', (req, res) => {
  req.accepts(['application/json']);

  if (!(req.body.natStatus)) {
    res.sendStatus(400);
    return;
  }

  let params = {
    email: req.body.email,
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

module.exports = router;
