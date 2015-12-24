'use strict';
const debug = require('debug')('models');
let express = require('express');
let util = require('util');
let _ = require('lodash');
let Account = require('../models/user.js');
let router = express.Router();

/*
 * PUT to update(turn on/off) router state.
 */
router.put('/router/state', (req, res) => {
  req.accepts(['application/json']);
  let username = req.body.username;
  let routerState = req.body.routerState;

  if (!(routerState && username)) {
    res.status(400).json({error: 'routerState or username should be set.'});
    return;
  }

  let params = {};
  params.UpdateExpression = 'SET #set.router.currentState = :routerState';
  params.ConditionExpression = '#user = :username';
  params.ExpressionAttributeNames = {
    '#user': 'username',
    '#set': 'settings',
  };
  params.ExpressionAttributeValues = {
    ':username': username,
    ':routerState': routerState,
  };

  Account.update({username: username}, params, (err, acc) => {
    if (err) debug(err);
    res.status(200).json({});
  });
});

/*
 * PUT to update router details settings.
 */
router.put('/router/details', (req, res) => {
  req.accepts(['application/json']);
  let username = req.body.username;
  let routerWANPort = req.body.wanPort;
  let routerPublicIP = req.body.publicIP;
  let routerDefultGateway = req.body.defultGateway;
  let routerLocalNetwork = req.body.localNetwork;

  let hasAll = username && routerWANPort && routerPublicIP &&
    routerDefultGateway && routerLocalNetwork;

  if (!(hasAll)) {
    res.status(400).json({
      error: 'Missing some paramters.',
    });
    return;
  }

  let params = {};
  let wanExp = '#set.router.wanPort = :wanPort';
  let pIPExp = '#set.router.publicIP = :publicIP';
  let dGWExp = '#set.router.defultGateway = :defultGateway';
  let locNExp = '#set.router.localNetwork = :localNetwork';

  params.UpdateExpression = `SET ${wanExp}, ${pIPExp}, ${dGWExp}, ${locNExp}`;
  params.ConditionExpression = '#user = :username';
  params.ExpressionAttributeNames = {
    '#user': 'username',
    '#set': 'settings',
  };
  params.ExpressionAttributeValues = {
    ':username': username,
    ':wanPort': routerWANPort,
    ':publicIP': routerPublicIP,
    ':defultGateway': routerDefultGateway,
    ':localNetwork': routerLocalNetwork,
  };

  Account.update({username: username}, params, (err, acc) => {
    if (err) debug(err);
    res.status(200).json({});
  });
});

/*
 * PUT to update container settings.
 */
router.put('/container', (req, res) => {

});

module.exports = router;
