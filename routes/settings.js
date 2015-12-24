'use strict';
const debug = require('debug')('models');
let express = require('express');
let util = require('util');
let _ = require('lodash');
let Account = require('../models/user.js');
let router = express.Router();

/*
 * PUT to update(turn on/off) router status.
 */
router.put('/router/status', (req, res) => {
  req.accepts(['application/json']);
  let username = req.body.username;
  let routerStatus = req.body.routerStatus;

  if (!(routerStatus && username)) {
    res.status(400).json({error: 'routerStatus or username should be set.'});
    return;
  }

  Account
    .query(username)
    .exec((err, resp) => {
      if (err) debug(err);

      if (resp.Count === 0) {
        res.status(204).json({});
        return;
      }

      // retrieve settings data
      let settings = (_.pluck(resp.Items, 'attrs'))[0].settings;

      // updated the router status
      settings.router.status = routerStatus;

      // Save into db
      Account.update({
        username: username,
        settings: settings,
      }, function(err, acc) {
        if (err) debug(err);
        res.status(200).json({});
      });

    });
});

/*
 * PUT to update router detail settings.
 */
router.put('/router/detail', (req, res) => {
  req.accepts(['application/json']);
  let username = req.body.username;
  let routerWANPort = req.body.routerWANPort;
  let routerPublicIP = req.body.routerPublicIP;
  let routerDefultGateway = req.body.routerDefultGateway;
  let routerLocalNetwork = req.body.routerLocalNetwork;

  if (!(username)) {
    res.status(400).json({error: 'username should be set.'});
    return;
  }

  Account
    .query(username)
    .exec((err, resp) => {
      if (err) debug(err);

      if (resp.Count === 0) {
        res.status(204).json({});
        return;
      }

      // retrieve settings data
      let settings = (_.pluck(resp.Items, 'attrs'))[0].settings;

      // updated the router detail settings.
      settings.router.wanPort = routerWANPort ?
        routerWANPort :
        settings.router.wanPort;

      settings.router.publicIP = routerPublicIP ?
        routerPublicIP :
        settings.router.publicIP;

      settings.router.defultGateway = routerDefultGateway ?
        routerDefultGateway :
        settings.router.defultGateway;

      settings.router.localNetwork = routerLocalNetwork ?
        routerLocalNetwork :
        settings.router.localNetwork;

      // Save into db
      Account.update({
        username: username,
        settings: settings,
      }, function(err, acc) {
        if (err) debug(err);
        res.status(200).json({});
      });

    });

});

/*
 * PUT to update container settings.
 */
router.put('/container', (req, res) => {

});

module.exports = router;
