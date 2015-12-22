'use strict';
const vogels = require('vogels');
const Joi = require('joi');
const config = require('config');
const debug = require('debug')('configure');

// Loading credentials from JSON file
// vogels.AWS.config.loadFromPath(`./config/credentials.json`);

vogels.AWS.config.update({
  accessKeyId: config.get('AWS_CREDENTIALS.accessKeyId') || process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.get('AWS_CREDENTIALS.secretAccessKey') ||  process.env.AWS_SECRET_ACCESS_KEY,
  region: config.get('AWS_CREDENTIALS.region') || process.env.AWS_REGION,
});

debug(`Now in ${process.env.NODE_ENV} mode!`);

let Account = vogels.define('Account', {
  hashKey: 'email',

  // add the timestamp attributes (updatedAt, createdAt)
  timestamps: true,
  schema: {
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    vCPEUUID: vogels.types.uuid(),
    settings: {
      containerid: Joi.string(),
      nickname: Joi.string(),
      router: {
        routerStatus: Joi.string(),
        routerWANPort: Joi.number(),
        routerPublicIP: Joi.string().ip(),
        routerDefultGateway: Joi.string().ip(),
        routerLocalNetwork: Joi.string().ip(),
      },
    },
  },
  tableName: 'vcpe-account',
});
module.exports = Account;
